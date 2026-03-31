// Note: These utilities expect window.firebaseX and window.firebaseDb to be available.
// In the Vite setup, we should ideally import from 'firebase/app' and 'firebase/firestore'.

export const fbGet = async (key, fallback) => {
  try {
    const uid = window.firebaseAuth?.currentUser?.uid;
    if (!window.firebaseDb || !uid) throw new Error("Not ready");
    const docRef = window.firebaseDoc(window.firebaseDb, "fitforge", `${uid}_${key}`);
    const snap = await window.firebaseGetDoc(docRef);
    if (snap.exists()) return snap.data().value;
    return fallback;
  } catch (e) {
    // Local fallback
    try {
      const r = localStorage.getItem("ff_" + key);
      return r ? JSON.parse(r) : fallback;
    } catch {
      return fallback;
    }
  }
};

export const fbSet = async (key, value) => {
  try {
    localStorage.setItem("ff_" + key, JSON.stringify(value));
    const uid = window.firebaseAuth?.currentUser?.uid;
    if (window.firebaseDb && uid) {
      await window.firebaseSetDoc(window.firebaseDoc(window.firebaseDb, "fitforge", `${uid}_${key}`), { value });
    }
  } catch (e) {
    console.error("fbSet error:", e);
  }
};

export const uploadToStorage = async (file, path) => {
  try {
    const uid = window.firebaseAuth?.currentUser?.uid;
    if (!window.firebaseStorage || !uid) throw new Error("Storage not ready");
    const fullPath = `fitforge/${path}`;
    const storageRef = window.firebaseRef(window.firebaseStorage, fullPath);
    await window.firebaseUploadBytes(storageRef, file);
    return await window.firebaseGetDownloadURL(storageRef);
  } catch (e) {
    // base64 fallback
    return new Promise(res => {
      const reader = new FileReader();
      reader.onload = e => res(e.target.result);
      reader.readAsDataURL(file);
    });
  }
};
