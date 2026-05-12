import { Input, Button,Typography } from '@mui/material';

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
    await addDoc(usersCollectionRef, { name: newName, age: +newAge });
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: +age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
    const handle = setInterval(getUsers, 2000);
    return () => clearInterval(handle);
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
          <Typography component="h1"> Name: {user.name}</Typography>
          <Typography component="h2"> Age: {user.age}</Typography>
          <Button variant="contained" 
            onClick={() => {
              updateUser(user.id, user.age);
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
