import { Input, Button } from '@mui/material';

import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase-new-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";


function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);

  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    console.log("creating");

    await addDoc(usersCollectionRef, { name: newName, age: +newAge });
  };

  const updateUser = async (id, age) => {
    console.log("updating");

    const userDoc = doc(db, "users", id);
    const newFields = { age: +age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    console.log("deleting");

    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
    setInterval(() => {
      getUsers();
    }, 2000);
  }, []);
  return (
    <div className="App">
      <Input
        placeholder="Name..."
        onChange={(e) => {
          setNewName(e.target.value);
        }}
      />
      <Input
        placeholder="Age..."
        onChange={(e) => {
          setNewAge(e.target.value);
        }}
      />
      <Button variant="contained" onClick={createUser}>Create User</Button>
      {users.map((user) => (
        <div key={user.id}>
          <h1> Name: {user.name}</h1>
          <h2> Age: {user.age}</h2>
          <Button variant="contained" 
            onClick={() => {
              updateUser(user.id, user.age, user.id);
            }}
          >
            Increase Age
          </Button>
          <Button  variant="contained"
            onClick={() => {
              deleteUser(user.id);
            }}
          >
            Delete User
          </Button>
        </div>
      ))}
    </div>
  );
}

export default App;
