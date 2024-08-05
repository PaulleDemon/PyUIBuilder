
const ImageFileExtensions = ["png", "gif", "jpg", "jpeg", "webp"]
const VideoFileExtensions = ["mp4", "webm", "m4v", "webm"]

export function getFileType(file){

    if (file.type?.startsWith("image") || ImageFileExtensions.includes(file.name.split(".").at(-1))){
        return "image"
    }else if (file.type?.startsWith("video") || VideoFileExtensions.includes(file.name.split(".").at(-1))){
        return "video"
    }else if(file.type?.startsWith("audio")){
        return "audio"
    }

    return "others"

}