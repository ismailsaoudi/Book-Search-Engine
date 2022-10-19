import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client'
// import { deleteBook } from '../utils/API';
import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations'
import { GET_ME } from '../utils/queries'
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const { loading, data } = useQuery( GET_ME );
  const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
    // All returning data from Apollo Client queries/mutations return in a `data` field, followed by the the data returned by the request
    update(cache, { data: { removeBook } }) {
      try {
        const { me } = cache.readQuery({ query: GET_ME });

        cache.writeQuery({
          query: GET_ME,
          data: { me: removeBook.savedBooks },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });
  

  

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (data){
          console.log(data.me)
          setUserData(data.me);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [data]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    console.log(bookId)
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    // upon success, remove book's id from localStorage
    removeBookId(bookId);
    try {
      const {updatedUser} = await removeBook({
        variables: {
          bookId
        }
      });

      setUserData(updatedUser);
      
    } catch (err) {
      console.error(err);
    }
  };
  
  const userDataLength = userData? Object.keys(userData).length: 0;
  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;