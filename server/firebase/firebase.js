const {
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  where,
} = require("firebase/firestore");
const db = require("./db.js");

exports.getAllUser = async () => {
  const querySnapshot = await getDocs(collection(db, "user"));
  const result = [];
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    result.push(doc);
  });
  return result;
};

exports.addUser = async (id, pw, phone, data) => {
  try {
    const docRef = await addDoc(collection(db, "user"), {
      id: id,
      pw: pw,
      phone: phone,
      data: data,
    });
    console.log("User added with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
};

exports.checkDuplicatePhone = async (phone) => {
  try {
    const q = query(collection(db, "user"), where("phone", "==", phone));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // 중복된 전화번호가 있으면 true, 없으면 false 반환
  } catch (error) {
    console.error("Error checking duplicate phone number:", error.message);
    return false; // 에러가 발생하면 중복이 없다고 가정
  }
};

exports.checkDuplicateID = async (id) => {
  try {
    const q = query(collection(db, "user"), where("id", "==", id));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // 중복된 ID가 있으면 true, 없으면 false 반환
  } catch (error) {
    console.error("Error checking duplicate id number:", error.message);
    return false; // 에러가 발생하면 중복이 없다고 가정
  }
};

exports.updateGradeArrayByUserdoc = (queryDocSnapshot, updatedGradeArray) => {
  return updateDoc(queryDocSnapshot.ref, {
    data: updatedGradeArray,
  });
};
