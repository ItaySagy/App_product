import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { v4 as uuidv4 } from "uuid";
import { createPost, updatePost } from "../../actions/posts";

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    creator: "",
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  });
  const post = useSelector((state) =>
    currentId ? state.posts.find((message) => message._id === currentId) : null
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({
      creator: "",
      title: "",
      message: "",
      tags: [],
      selectedFile: "",
    });
  };

  const generateNumericId = () => {
    const newId = Number(uuidv4().replace(/\D/g, "")); // Generate numeric ID
    return newId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      const newTag = generateNumericId(); // Generate a numeric ID
      dispatch(createPost({ ...postData, tags: [...postData.tags, newTag] }));
      clear();
    } else {
      dispatch(updatePost(currentId, postData));
      clear();
    }
  };

  return (
    <Paper>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h6">
          {currentId ? `Editing "${post.title}"` : "Create a product"}
        </Typography>
        <TextField
          name="creator"
          variant="outlined"
          label="Name"
          fullWidth
          value={postData.creator}
          onChange={(e) =>
            setPostData({ ...postData, creator: e.target.value })
          }
          required
          inputProps={{ maxLength: 30 }} // Limit to 30 characters
        />
        <TextField
          name="title"
          variant="outlined"
          label="Price"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          inputProps={{ min: 0 }} // Minimum value is 0
          required
        />
        <TextField
          name="message"
          variant="outlined"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
          required
          inputProps={{ maxLength: 200 }} // Limit to 200 characters
        />
        <TextField
          name="tags"
          variant="outlined"
          label="ID"
          fullWidth
          value={postData.tags.join(", ")}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(", ") })
          }
        />
        <div>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
