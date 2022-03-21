<script lang="ts">
    import fileSettingStore from "../../../stores/fileSettingStore";
    import type { FileUI, FileUIGroup } from "../../../types/UITypes";
    import Accordion from "../../commons/Accordion.svelte";
    import FileGrid from "./FileGrid.svelte";
    import { groupByDateClasification } from "../../../helpers/Date";
    import { getFileType } from "../../../helpers/Media";

    export let files: FileUI[] = [];

    function getFileGroup(file: FileUI, group: string): string {
        switch (group) {
            case "type":
                return getFileType(file);
            case "creation":
            case "modification":
                return groupByDateClasification(new Date(file[group]));
            default:
                return "";
        }
    }

    function groupFiles(files: FileUI[] = [], group: string): FileUIGroup[] {
        let groupedFiles: FileUIGroup[] = [];
        let fileMap = {};
        files.forEach((file) => {
            let fileGroup = getFileGroup(file, group);
            if (!fileMap[fileGroup]) {
                fileMap[fileGroup] = [];
            }
            fileMap[fileGroup].push(file);
        });
        for (let key in fileMap) {
            groupedFiles.push({ group: key, files: fileMap[key] });
        }
        groupedFiles.sort((a, b) => {
            try {
                if (group === "type") {
                    return a.group > b.group ? 1 : -1;
                }
                let f1 = a.files[0][group];
                let f2 = b.files[0][group];
                return new Date(f1) > new Date(f2) ? -1 : 1;
            } catch (e) {
                return 0;
            }
        });
        return groupedFiles;
    }

    function calculatePreviousLength(index: number): number {
        let size = 0;
        for (let i = 0; i < index; i++) {
            size += filesGroup[i].files.length;
        }
        return size;
    }

    $: filesGroup = $fileSettingStore.groupBy
        ? groupFiles(files, $fileSettingStore.groupBy)
        : [];
</script>

{#if !$fileSettingStore.groupBy}
    <FileGrid {files} />
{:else}
    {#each filesGroup as fileGroup, index}
        <Accordion title={fileGroup.group} id={fileGroup.group}>
            <FileGrid
                files={fileGroup.files}
                parentIndex={calculatePreviousLength(index)}
            />
        </Accordion>
    {/each}
{/if}
