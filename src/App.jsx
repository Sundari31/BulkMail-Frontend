import { useState } from 'react'
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {

  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList, setemailList] = useState([])

  function handleMsg(evt) {
    setMsg(evt.target.value)
  }

  function handleFile(event) {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = function (event) {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emailList.map(item => item.A)
      setemailList(totalemail)
    }

    reader.readAsBinaryString(file)
  }

  function send() {
    setStatus(true)
    axios.post("https://bulkmail-backend-1-0azx.onrender.com/", { msg: msg, emailList: emailList })
      .then(function (res) {
    if (res.data.success) {
      alert("✅ Email Sent Successfully")
    } else {
      alert("❌ Failed to send emails")
    }
    setStatus(false);
  })
  .catch(function (err) {
    console.error(err);
    alert("⚠️ Error: " + err.message)
    setStatus(false)
  })
}

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 flex flex-col">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md py-6 px-8 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">BulkMail</h1>
        <p className="text-gray-600 mt-1">Send smarter. Send faster. 🚀</p>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 flex flex-col gap-8">
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 text-center">Compose & Send Emails</h2>

          {/* Message Box */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Your Message</label>
            <textarea
              onChange={handleMsg}
              value={msg}
              className="w-full h-32 p-3 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none resize-none shadow-sm"
              placeholder="Write something amazing to send..."
            ></textarea>
          </div>

          {/* File Upload */}
          <div className='flex flex-col justify-center items-center'>
            <label className="block text-gray-700 font-semibold mb-3">Upload Email List</label>
            <label className="w-full border-2 border-dashed border-indigo-400 rounded-2xl p-8 text-center cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
              <input type="file" onChange={handleFile} className="hidden" />
              <span className="text-indigo-700 font-medium text-lg">📂 Drag & Drop or Click to Upload</span>
            </label>
          </div>

          {/* Email Count */}
          <div className="text-center">
            <p className="text-gray-700 text-base">
              Loaded Emails: <span className="font-bold text-indigo-600">{emailList.length}</span>
            </p>
          </div>

          {/* Send Button */}
          <button
            onClick={send}
            disabled={status}
            className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all"
          >
            {status ? "📨 Sending..." : "✨ Send Emails"}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-md text-center py-4 border-t border-gray-200 text-gray-600 text-sm">
        © 2025 BulkMail 
      </footer>
    </div>
  )
}

export default App
