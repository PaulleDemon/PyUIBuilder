

export function getPythonAssetPath(fileName, fileType){

    let assetPath = "others"

    switch (fileType) {
        case "image":
            assetPath = "images"
            break

        case "video":
            assetPath = "videos"
            break

        case "audio":
            assetPath = "audios"
            break

        default:
            break
    }

    return `os.path.join("assets", "${assetPath}", "${fileName}")`

}