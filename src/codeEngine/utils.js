import JSZip from "jszip"


/**
 * 
 * @param {[]} fileDataArray - [{fileData: "", fileName: "", folder: ""}]
 */
export async function createFilesAndDownload(fileDataArray, zipName="untitled"){

    const zip = new JSZip()

    fileDataArray.forEach(file => {
        const { fileData, fileName, folder } = file

        // If a folder is specified, create it if it doesn't exist
        if (folder) {
            const folderRef = zip.folder(folder) 
            folderRef.file(fileName, fileData)
            
        } else {
            // If no folder is specified, place the file in the root
            zip.file(fileName, fileData)
        }
    })

    // Generate the ZIP asynchronously
    zip.generateAsync({ type: "blob" }).then(function(content) {
        const link = document.createElement("a")
        link.href = URL.createObjectURL(content)
        link.download = `${zipName}.zip`
        link.click() 
    })

}