import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //fetchNotes
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: token },
      });
      setNotes(res.data);
    } catch (error) {
      alert("Unauthorized, please login again");
      navigate("/");
    }
  };
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchNotes();
    }
  }, []);

  // Add or Update Note

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/notes/update/${editId}`,
          { title, content },
          { headers: { Authorization: token } },
        );
      }
      else{
        await axios.post(
          `http://localhost:5000/api/notes/add`,
          { title, content },
          { headers: { Authorization: token } },
        );
      }
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      alert("somthing went wrong");
    }
  };

  //Delete Notes

  const deleteNotes = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/delete/${id}`, {
      headers: { Authorization: token },
    });
    fetchNotes();
  };

  //Edit Notes
  const editNotes = (notes) => {
    setTitle(notes.title);
    setContent(notes.content);
    setEditId(notes._id);
  };

  //Logout

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
     <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md mb-6"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 p-2 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Content"
          className="w-full mb-3 p-2 border rounded-lg"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`px-4 py-2 rounded-lg text-white ${
            editId ? "bg-yellow-500" : "bg-blue-500"
          }`}
        >
          {editId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      <div className="grid md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-4 rounded-2xl shadow-md"
          >
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-600 mt-2">{note.content}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => editNotes(note)}
                className="bg-yellow-400 px-3 py-1 rounded-lg text-white"
              >
                Edit
              </button>

              <button
                onClick={() => deleteNotes(note._id)}
                className="bg-red-500 px-3 py-1 rounded-lg text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}


export default Dashboard;
