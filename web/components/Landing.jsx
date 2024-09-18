import React, { useEffect } from "react";
import { useState } from "react";

function Landing() {
  const [books, setBooks] = useState([]);

  async function getBooks() {
    try {
      const response = await fetch(`http://localhost:5001/books`);

      if (response.ok) {
        const datos = await response.json();

        console.log(datos);
        setBooks(datos.results);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      <header className="container-father">
        {books.map((book) => (
          <div className="preview" key={book.idBooks}>
            <div className="bookImage"></div>
            <div className="card-books">
              <div className="books">
                <div className="image">
                  <img className="img" src={book.image} />
                </div>
                <h1 className="title">{book.title}</h1>
                <h3 className="name">
                  {book.name} {book.lastname}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </header>
    </>
  );
}

export default Landing;
