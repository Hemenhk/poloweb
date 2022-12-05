import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { Image } from "react-bootstrap";

const PostCreateForm = () => {

  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  })

  const { title, content, image } = postData;

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value
    })
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      })
    }
  };

  const textFields = (
    <div className="text-center">
      <Form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            onChange={handleChange}
            type="text"
            name="title"
            value={title}
          >
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control
            onChange={handleChange}
            as="textarea"
            rows={6}
            name="content"
            value={content}
          >
          </Form.Control>
        </Form.Group>
      </Form>



      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => { }}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >

            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded/>
                  </figure>
                  <div>
                    <Form.Label 
                      className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                      htmlFor="image-upload">
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                className="d-flex justify-content-center"
                htmlFor="image-upload"
                >
                <Asset src={Upload} message="Click or tap to upload an image" />
                </Form.Label>
              )}

            <Form.File id="image-upload" accept="image/*" onChange={handleChangeImage} />

          </Form.Group>
          <div className="d-md-none">{textFields}</div>
        </Container>
      </Col>
      <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
        <Container className={appStyles.Content}>{textFields}</Container>
      </Col>
    </Row>
    </Form >
  );
}

export default PostCreateForm;