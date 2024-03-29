import FileBrowser from "../constants/FileBrowser"
import FileService from "../services/FileService"
import type { FileUI, MediaIcon } from "../types/UITypes";
import type { FileApiResponse } from "../types/ApiTypes"

function getFileType(file: FileApiResponse): string {
    if (file?.isDirectory) {
        return 'folder'
    }
    let fileNameParts = file?.name?.split('.') || []
    return (fileNameParts[fileNameParts.length - 1] || '').toLowerCase()
}

function getFileIcon(file: FileApiResponse): MediaIcon {
    let { innerWidth, innerHeight } = window
    let fileType = getFileType(file)
    switch (true) {
        case file.isDirectory:
            return {
                icon: "fas fa-folder",
                asset: false,
                preview: false,
                type: 'folder'
            }
        case FileBrowser.previews.image.includes(fileType):
            let iconSize = FileBrowser.previews.scalePreview.includes(fileType) ? 200 : 0
            let resize = 0
            if (file.width > innerWidth * 3 || file.height > innerHeight * 3) {
                resize = innerWidth > innerHeight ? innerWidth * 2 : innerHeight * 2
            }
            let data: MediaIcon = {
                icon: FileService.preview(file, iconSize),
                src: FileService.preview(file, resize),
                preview: true,
                type: fileType
            }
            if (resize > 0) {
                data.srcOriginal = FileService.preview(file)
            }
            return data
        case FileBrowser.previews.icons.png.includes(fileType):
            return {
                icon: `assets/image/${fileType}.png`,
                asset: true,
                preview: false,
                type: fileType
            }
        case FileBrowser.previews.icons.svg.includes(fileType):
            return {
                icon: `assets/image/${fileType}.svg`,
                asset: true,
                preview: false,
                type: fileType
            }
        default:
            return {
                icon: "fas fa-file",
                asset: false,
                preview: false,
                type: fileType
            }
    }
}


function getSizeMb(bytesSize: number): string {
    if (bytesSize > 1024 * 1024 * 1024) {
        return `${(bytesSize / (1024 * 1024 * 1024)).toFixed(2)} Gb`
    } else if (bytesSize > 1024 * 1024) {
        return `${(bytesSize / (1024 * 1024)).toFixed(2)} Mb`
    } else if (bytesSize > 1024) {
        return `${(bytesSize / 1024).toFixed(2)} kb`
    }
    return `${bytesSize} bytes`
}


function isBookmark(bookmarks: FileApiResponse[] = [], item: FileUI): boolean {
    if (!item) {
        return false
    }
    return bookmarks.find(bookmark => item.route + item.name === bookmark.route + bookmark.name) ? true : false
}

function mapCustomFiles(files: File[] = []): FileApiResponse[] {
    return files.map(f => ({
        isDirectory: false,
        name: f.name,
        size: f.size,
        creation: new Date().toISOString(),
        modification: new Date(f.lastModified).toISOString(),
    }))
}

function getLastTreeName(route: string): string {
    let separateRoot = route.split("/");
    return separateRoot[separateRoot.length - 1];
}

export {
    getFileType,
    getFileIcon,
    getSizeMb,
    mapCustomFiles,
    isBookmark,
    getLastTreeName
}