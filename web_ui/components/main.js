const { client,connectToDatabase, createDocument, findDocuments, deleteDocument, updateDocument, closeConnection } = require('./crud.js');
const express = require('express');

const app = express();

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function searching() 
{
    /*
    var db = await connectToDatabase();
    //document.getElementById('input')
    const product_name = document.getElementById('input').innerHTML;
    await createDocuments(db, 'fromNode', {name: product_name});
    */
    var base_url = document.getElementById("input").textContent;
    var xhr = new XMLHttpRequest();
    // Create an object with the data you want to send
    var dataToSend = {
        from: "web browser"
    };
    var url = base_url + "?date=27/09/2023";
    var jsonData = JSON.stringify(dataToSend);
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json"); // Specify JSON content type
    xhr.responseType = 'json';
    xhr.send(jsonData);
    xhr.onload = function() {
      if (xhr.status === 200) {
        const response = JSON.stringify(xhr.response);
        document.getElementById("content").innerHTML = response;
      } else {
        document.getElementById("content").innerHTML = "Error loading URL";
      }
    };
  });
}
async function main() {
    var db = await connectToDatabase();  
    // Create a new document
    var _document = {
        _name: 'Nhat Tung',
        _age: '3tuoi',
        _hobby: ['basketball','sleep'],
        _authentication:{
            username: 'tung3T',
            password: '123456',
            status: true
        }
      }
    //await createDocument(db, 'fromNode', _document);
    await deleteDocument(db, 'fromNode', {name: 'Quang Nguyen'});
    await closeConnection();
}  
main().catch(console.error);
//run().catch(console.dir);
// Start the server.
app.listen(8080);
