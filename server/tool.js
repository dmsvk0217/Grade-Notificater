const {
  getDocs,
  doc,
  query,
  getDoc,
  where,
  deleteDoc,
  updateDoc,
  collection,
  orderBy,
} = require("firebase/firestore");
const db = require("./db.js");
const userCollection = "user";

// 1. user collection에서 총 문서의 갯수 출력
async function getTotalDocumentCount() {
  const querySnapshot = await getDocs(collection(db, userCollection));
  const count = querySnapshot.size;
  console.log(`Total document count: ${count}`);
}

// 2. user collection에서 특정 id를 가진 문서 존재 여부 출력
async function checkDocumentExistsById(userId) {
  const q = query(collection(db, userCollection), where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  const exists = !querySnapshot.empty;

  console.log(
    `Document with ID ${userId} ${exists ? "exists" : "does not exist"}`
  );
}

// 3. user collection에서 특정 phone을 가진 문서의 id 출력
async function getUserIdByPhone(phone) {
  const q = query(collection(db, userCollection), where("phone", "==", phone));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`ID with phone ${phone}: ${doc.id}`);
  });
}

// 4. user collection에서 특정 id를 가진 문서 삭제
async function deleteDocumentById(userId) {
  try {
    const userCollectionRef = collection(db, userCollection); // Replace with your actual collection name
    const q = query(userCollectionRef, where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];

      // Construct a reference to the document using its reference path
      const docRef = doc(db, docToDelete.ref.path);

      // Delete the document
      await deleteDoc(docRef);
      console.log(`Document with ID ${userId} deleted`);
    } else {
      console.log(`Document with ID ${userId} does not exist`);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

// 5. user collection에서 특정 id를 가진 문서의 phone 수정
async function updatePhoneById(userId, newPhone) {
  const q = query(collection(db, userCollection), where("id", "==", userId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docToUpdate = querySnapshot.docs[0];
    const docRef = doc(db, userCollection, docToUpdate.id);
    await updateDoc(docRef, { phone: newPhone });
    console.log(`Phone for document with ID ${userId} updated to ${newPhone}`);
  } else {
    console.log(`Document with ID ${userId} does not exist`);
  }
}

async function printAllDocumentIds() {
  const q = query(collection(db, userCollection), orderBy("id", "asc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    console.log(`Document ID: ${doc.data().id}`);
  });
}

// 호출
// printAllDocumentIds().finally(() => console.log("Printing completed."));
deleteDocumentById("jn7656");
getTotalDocumentCount().finally(() => console.log("Printing completed."));
// checkDocumentExistsById("kimgoeun0315");
// getUserIdByPhone("01026459670");
