import { selectKeys } from "../helpers/Misc"
import type { FileUI, TxtLang } from "../types/UITypes"

const TxtLangES: TxtLang = {
    label: {
        view: "Vista",
        itemName: "elementos",
        filtered: "filtrados",
        selected: "seleccionados",
        goBack: "Regresar",
        config: "Configuración",
        logout: "Salir",
        usersControl: "Control de accesos",
        addElement: "Agregar elemento",
        fileDetail: "Detalle elemento",
        goTo: "Ir a ruta"
    },
    selectOptions: {
        sortBy: {
            label: "Ordenamiento",
            options: selectKeys({
                name: "Nombre",
                size: "Tamaño",
                creation: "Creación",
                modification: "Modificación"
            })
        },
        groupBy: {
            label: "Agrupación",
            options: selectKeys({
                none: "---",
                type: "Tipo de archivo",
                creation: "Fecha Creación",
                modification: "Fecha Modificación"
            })
        }
    },
    forms: {
        file: {
            title: "",
            labels: {
                name: "Nombre",
                route: "Ruta",
                bookmarksGroup: "Grupo Marcadores",
                size: "Tamaño",
                creation: "Creación",
                lastModification: "Última Modificación",
                files: "Archivos"
            },
            selects: [
                {
                    label: "Tipo de elemento",
                    options: selectKeys({
                        folder: "Folder",
                        plain: "Archivo",
                        file: "Carga multiple"
                    })
                }
            ],
            validations: {
                required: `* El campo es obligatorio`,
                exist: (name: string) => `El archivo ${name} ya existe en la ruta`,
                regexp: `* Los nombres de archivos no pueden contener los caracteres " / ? * : | < > \ `,
                update: `* El campo no ha sido actualizado`,
                incomplete: "No se puede completar la información de carpeta"
            },
            options: {
                submit: "Agregar",
                edit: "Modificar",
                cancel: "Cancelar"
            }
        },
        bookmark: {
            title: "",
            labels: {
                title: "Titulo",
                target: "Archivo",
                group: "Grupo"

            },
            validations: {
                exist: (newGroup: boolean) => newGroup
                    ? `El nombre ya existe en lista`
                    : `El nombre no ha sido modificado`
            },
            options: {
                edit: "Editar",
                create: "Agregar",
                cancel: "Cancelar"
            }
        },
        path: {
            title: "",
            labels: {
                route: "Directorio"
            },
            options: {
                submit: "Aceptar",
            }
        },
        settings: {
            title: "Preferencias",
            labels: {
                theme: "Tema",
                animations: "Animaciones de explorador",
                language: "Lenguaje"
            }
        },
        profile: {
            title: "Informacion de Usuario",
            labels: {
                user: "Usuario",
                rol: "Rol",
                scope: "Scope inicial"
            }
        },
        session: {
            title: "Sesión",
            labels: {
                duration: "Duración"
            },
            options: {
                submit: "Actualizar",
                cancel: "Cancelar"
            },
            success: "Tiempo de sesion actualizado"
        },
        password: {
            title: "Cambiar Password",
            validations: {
                validateKey: "Los valores ingresados no coinciden",
                key: "El nuevo password no puede ser igual al anterior",
                prevKey: "El password actual es incorrecto"
            },
            labels: {
                password: "Password",
                confirmPassword: "Confirmar Password",
                prevPassword: "Password previo"
            },
            options: {
                submit: "Actualizar"
            },
            success: "Password actualizado"
        },
        user: {
            title: "Control de accesos",
            validations: {
                routesRequired: "Debe agregar una ruta",
                routesExist: "Existe ya una ruta relacionada a la ingresada",
                routeInitial: "Es necesario ingresar al menos una ruta inicial"
            },
            labels: {
                user: "Usuario",
                password: "Password",
                sessionTime: "Tiempo de sesión",
                routes: "Rutas de acceso",
                creation: "Creación"
            },
            options: {
                editAction: "Editar",
                createAction: "Nuevo acceso",
                edit: "Modificar",
                create: "Agregar",
                cancel: "Cancelar"
            },
            success: "Usuario creado",
            successEdit: "Usuario actualizado"
        }
    },
    dialogs: {
        deleteGroup: (name: string) => `¿Esta seguro de eliminar ${name}? Todos los marcadores relacionados serán eliminados.`,
        uploadFile: (number: number, route: string) => `${number} archivos subidos a ${route}`,
        deleteUser: (user: string) => `${user} fue eliminado`,
        confirmDeleteUser: (user: string) => `¿Está seguro de eliminar ${user}?`,
        usersListError: (err: string) => `No se pudieron recuperar usuarios: ${err}`,
        fileListError: () => "Se presento un problema al operar los archivos: ",
        deleteFiles: (files: FileUI[]) => `¿Está seguro de eliminar ${files.length > 1
            ? `los ${files.length} elementos seleccionados`
            : ` ${files[0].name}?`
            }?`,
        fileNotSelected: () => "No se ha seleccionado ningún elemento",
        confirmDeletedFiles: (files: FileUI[]) => files.length === 1 ? `${files[0].name} fue eliminado` : `${files.length} archivos eliminados`,
        fileMoveCopy: (files: FileUI[], move: boolean) => files.length > 1 ? `${files.length} archivos ${move ? "movidos" : "copiados"
            }` : `${files[0].name} ${move ? "movido" : "copiado"}`
    },
    contextMenu: {
        parent: {
            addFiles: () => "Agregar archivos",
            fileOptions: (viewOptions: boolean) => `${viewOptions ? "Ocultar" : "Mostrar"
                } opciones de archivo`,
            checkFiles: (checkAll: boolean) => checkAll
                ? "Deseleccionar todos"
                : "Seleccionar todos",
            pasteFile: () => "Pegar",
            fileInfo: (name: string) => `Información de ${name} `
        },
        items: {
            ubication: () => "Ir a ubicación del archivo",
            selection: (checked: boolean) => checked
                ? "Deseleccionar elemento"
                : "Seleccionar elemento",
            copy: (checked: boolean) => checked
                ? `Copiar seleccionados`
                : "Copiar",
            move: (checked: boolean) => checked
                ? `Mover seleccionados`
                : "Mover",
            trash: (checked: boolean) => checked
                ? `Eliminar seleccionados`
                : "Eliminar",
            download: (checked: boolean) => checked
                ? `Descargar seleccionados`
                : "Descargar",
            information: () => "Información",
            bookmark: (validateBookmark: boolean) => `${validateBookmark ? "Quitar de " : "Agregar a "
                } Marcadores`
        }
    }
}

const TxtLangEN: TxtLang = {
    label: {
        view: "View",
        itemName: "elements",
        filtered: "filtered",
        selected: "selected",
        goBack: "Go back",
        config: "Configuration",
        logout: "Logout",
        usersControl: "Access control",
        addElement: "Add element",
        fileDetail: "Detail",
        goTo: "Go to route"
    },
    selectOptions: {
        sortBy: {
            label: "Order by",
            options: selectKeys({
                name: "Name",
                size: "Size",
                creation: "Creation date",
                modification: "Date modified"
            })
        },
        groupBy: {
            label: "Group by",
            options: selectKeys({
                none: "---",
                type: "Tipo de archivo",
                creation: "Creation date",
                modification: "Date modified"
            })
        }
    },
    forms: {
        file: {
            title: "",
            labels: {
                name: "Name",
                route: "Route",
                bookmarksGroup: "Bookmarks group",
                size: "Size",
                creation: "Created",
                lastModification: "Date modified",
                files: "Files"
            },
            selects: [
                {
                    label: "Type",
                    options: selectKeys({
                        folder: "Folder",
                        plain: "File",
                        file: "Multiple files"
                    })
                }
            ],
            validations: {
                required: `* This field is required`,
                exist: (name: string) => `${name} already exist`,
                regexp: `* File names cannot contain these characters " / ? * : | < > \ `,
                update: `* The field has not been updated`,
                incomplete: "Folder information could not be loaded"
            },
            options: {
                submit: "Add",
                edit: "Edit",
                cancel: "Cancel"
            }
        },
        bookmark: {
            title: "",
            labels: {
                title: "Title",
                target: "File",
                group: "Group"

            },
            validations: {
                exist: (newGroup: boolean) => newGroup
                    ? `The name already exist in list`
                    : `The name has not been modified`
            },
            options: {
                edit: "Edit",
                create: "Add",
                cancel: "Cancel"
            }
        },
        path: {
            title: "",
            labels: {
                route: "Route"
            },
            options: {
                submit: "Accept",
            }
        },
        settings: {
            title: "Preference",
            labels: {
                theme: "Theme",
                animations: "Explorer animations",
                language: "Languages"
            }
        },
        profile: {
            title: "User information",
            labels: {
                user: "User",
                rol: "Rol",
                scope: "Initial scope"
            }
        },
        session: {
            title: "Session",
            labels: {
                duration: "Session time"
            },
            options: {
                submit: "Update",
                cancel: "Cancel"
            },
            success: "Session time updated"
        },
        password: {
            title: "Change Password",
            validations: {
                validateKey: "The passwords are not the same",
                key: "New password cannot be the same as your old password",
                prevKey: "Current password invalid"
            },
            labels: {
                password: "Password",
                confirmPassword: "Confirm Password",
                prevPassword: "Previous password"
            },
            options: {
                submit: "Update"
            },
            success: "Password updated"
        },
        user: {
            title: "Access control",
            validations: {
                routesRequired: "A route must be added",
                routesExist: "Route already exist",
                routeInitial: "An initial route must be added"
            },
            labels: {
                user: "User",
                password: "Password",
                sessionTime: "Session time",
                routes: "Initial Scope",
                creation: "Creation"
            },
            options: {
                editAction: "Edit",
                createAction: "New access",
                edit: "Modify",
                create: "Add",
                cancel: "Cancel"
            },
            success: "User created",
            successEdit: "User updated"
        }
    },
    dialogs: {
        deleteGroup: (name: string) => `are you sure you want to delete ${name}?. All the bookmarks related will be erased`,
        uploadFile: (number: number, route: string) => `${number} files uploaded to ${route}`,
        deleteUser: (user: string) => `${user} deleted`,
        confirmDeleteUser: (user: string) => `are you sure you want to delete ${user}?`,
        usersListError: (err: string) => `Users could not be loaded: ${err}`,
        fileListError: () => "There was a problem with the operation: ",
        deleteFiles: (files: FileUI[]) => `are you sure you want to delete ${files.length > 1
            ? ` ${files.length} elements selected`
            : ` ${files[0].name}?`
            }?`,
        fileNotSelected: () => "There are not elements selected",
        confirmDeletedFiles: (files: FileUI[]) => files.length === 1 ? `${files[0].name} deleted` : `${files.length} files deleted`,
        fileMoveCopy: (files: FileUI[], move: boolean) => files.length > 1 ? `${files.length} files ${move ? "moved" : "copied"
            }` : `${files[0].name} ${move ? "moved" : "copied"}`
    },
    contextMenu: {
        parent: {
            addFiles: () => "Add files",
            fileOptions: (viewOptions: boolean) => `${viewOptions ? "Hide" : "Show"
                } file options`,
            checkFiles: (checkAll: boolean) => checkAll
                ? "Unmark all"
                : "Mark all",
            pasteFile: () => "Pegar",
            fileInfo: (name: string) => `${name}'s information `
        },
        items: {
            ubication: () => "Go to file location",
            selection: (checked: boolean) => checked
                ? "Unmark element"
                : "Mark element",
            copy: (checked: boolean) => checked
                ? `Copy marked`
                : "Copy",
            move: (checked: boolean) => checked
                ? `Move marked`
                : "Move",
            trash: (checked: boolean) => checked
                ? `Delete marked`
                : "Delete",
            download: (checked: boolean) => checked
                ? `Download marked`
                : "Download",
            information: () => "Information",
            bookmark: (validateBookmark: boolean) => `${validateBookmark ? "Remove from" : "Add in "
                } bookmarks`
        }
    }
}


export default {
    "ES": TxtLangES,
    "EN": TxtLangEN
}