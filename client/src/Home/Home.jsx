import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Image,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  OrderedList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
const Home = () => {
  const [img, setimg] = useState(null);
  const [data, setData] = useState(null);
  const [strip, setStrip] = useState(null);
  const [loaded, setloaded] = useState(false);
  const [imgURL, setimgURL] = useState("");

  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (img == null) {
      toast({
        position: "bottom-right",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            Upload a strip image before Analysing !
          </Box>
        ),
      });
    }

    const formdata = new FormData();
    formdata.append("file", img, img.name);

    try {
      const res = await axios
        .post("http://localhost:8000/analyze", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("JSON RESPONSE");
          console.log(res.data);
          if (res.status == 200) {
            setData(res.data);
            setloaded(true);
            setStrip(Object.values(res.data));
          } else {
            toast({
              position: "bottom-right",
              render: () => (
                <Box color="white" p={3} bg="red.500">
                  Sorry ! could not proccess that request , Internal Server
                  Error
                </Box>
              ),
            });
          }
        });
    } catch (err) {
      console.log(err);
      toast({
        position: "bottom-right",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            Sorry ! could not proccess that request , Internal Server
            Error
          </Box>
        ),
      });
    }
  };

  // sets image for preview
  const handleImgChange = (e) => {
    e.preventDefault();
    let img = e.target.files[0];
    setimg(img);
    setData(null);
    setStrip(null);
    setloaded(false);
    setimgURL(URL.createObjectURL(img));
  };
  const jsonList = () => {
    if (loaded) {
      const renderList = [];
      Object.keys(data).forEach((key, i) => {
        let val = data[key];
        renderList.push(
          <span key={i}> {key} : [{val[0]},{val[1]},{val[2]}] ,</span>
        );
      });
      return (renderList);
    } else {
      return <></>;
    }
  };
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(arr) {
    return (
      "#" +
      componentToHex(arr[0]) +
      componentToHex(arr[1]) +
      componentToHex(arr[2])
    );
  }

  const stripBuilder = () => {
    if (loaded) {
      const render_strip = [];
      strip.forEach((element,i) => {
        const color = rgbToHex(element);
        render_strip.push(
          <Center key={i}
            margin="0"
            padding="0"
            width="50px"
            height="50px"
            bg={color}
          ></Center>
        );
        render_strip.push(
          <Center key={i+100}
            margin="0"
            padding="0"
            width="2px"
            height="50px"
            bg="blackAlpha.100"
          ></Center>
        );
      });

      return render_strip;
    } else {
      return (
        <Center>
          <h4>Color Strip</h4>
        </Center>
      );
    }
  };
  return (
    <>
      <div>
        <h1>Urine Strip Analyzer</h1>
      </div>
      <Box width="95vw" ml="auto" mr="auto" mt="2rem">
        <Flex direction="row" justifyContent="space-between">
          <Flex
            height="65vh"
            direction="column"
            padding="2rem"
            bg="gray.800"
            border="2px solid white"
            borderRadius="10"
            flex="1"
          >
            <Center>
              {imgURL == "" ? (
                <h4>Upload ⬆️</h4>
              ) : (
                <Image
                  boxSize="300px"
                  objectFit="contain"
                  src={imgURL}
                  alt="strip image"
                />
              )}
            </Center>
          </Flex>

          <Flex direction="column" flex="3" ml="6rem" alignItems="center">
            <Box width="40vw">
              <FormControl mb="0.5rem" isRequired="true">
                <FormLabel>Input the image of the test strip</FormLabel>
                <Input
                  onChange={handleImgChange}
                  type="file"
                  accept=".jpg"
                ></Input>
                <FormHelperText>In .JPG format</FormHelperText>
              </FormControl>
              <Button
                type="submit"
                onClick={handleSubmit}
                width="20vw"
                bg="blue.700"
              >
                Analyze!
              </Button>
            </Box>
            <Flex
              width="100%"
              direction="row"
              justifyContent="center"
              alignItems="center"
              mt="1rem"
              padding="2rem"
              bg="gray.800"
              border="2px solid white"
              borderRadius="10"
            >
              {stripBuilder()}
            </Flex>
            <Box mt="1rem" width="60vw">
              <h3>JSON Ouput</h3>
              {jsonList()}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Home;
