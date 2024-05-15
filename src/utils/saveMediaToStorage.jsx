import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FIREBASE_STORAGE } from "@/firebaseConfig";

export const saveMediaToStorage = async (blob, path) => {
  const fileRef = ref(FIREBASE_STORAGE, path);

  await uploadBytesResumable(fileRef, blob);

  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
};
