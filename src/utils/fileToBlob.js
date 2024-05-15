async function fileToBlob(file) {
    // Since the file input returns a File object, and File is a subclass of Blob,
    // you can directly return the file object as a blob.
    return new Blob([file], { type: file.type });
}


export default fileToBlob