import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
} from "@chakra-ui/react";

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
            Upload a strip image before Analysing!
          </Box>
        ),
      });
      return;
    }

    const formdata = new FormData();
    formdata.append("file", img, img.name);

    try {
      const res = await axios.post("http://localhost:8000/analyze", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setData(res.data);
        setloaded(true);
        setStrip(Object.values(res.data));
      } else {
        throw new Error("Internal Server Error");
      }
    } catch (err) {
      console.log(err);
      toast({
        position: "bottom-right",
        render: () => (
          <Box color="white" p={3} bg="red.500">
            Sorry! Could not process that request, Internal Server Error
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
      return Object.keys(data).map((key, i) => {
        let val = data[key];
        return (
          <Text key={i} fontSize="md">
            {key}: [{val[0]},{val[1]},{val[2]}]
          </Text>
        );
      });
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
      return strip.map((element, i) => {
        const color = rgbToHex(element);
        return (
          <Center
            key={i}
            margin="0"
            padding="0"
            width="50px"
            height="50px"
            bg={color}
            border="1px solid #ddd"
          ></Center>
        );
      });
    } else {
      return (
        <Center>
          <Text fontSize="lg" color="gray.500">
            Color Strip
          </Text>
        </Center>
      );
    }
  };

  return (
    <>
      <Box bg="blue.800" color="white" p={5} textAlign="center">
        <Heading>Urine Strip Analyzer</Heading>
      </Box>
      <Box width="95vw" ml="auto" mr="auto" mt="2rem">
        <Flex direction="column" alignItems="center">
          <Flex
            direction="column"
            alignItems="center"
            padding="2rem"
            bg="gray.700"
            border="2px solid white"
            borderRadius="10px"
            width="full"
            maxWidth="600px"
          >
            <Center>
              {imgURL === "" ? (
                <Text fontSize="lg" color="gray.300">
                  Upload ⬆️
                </Text>
              ) : (
                <Image
                  boxSize="300px"
                  objectFit="contain"
                  src={imgURL}
                  alt="strip image"
                  borderRadius="10px"
                />
              )}
            </Center>
          </Flex>

          <VStack spacing={5} mt={8} width="full" maxWidth="600px">
            <FormControl isRequired>
              <FormLabel color="gray.700">Input the image of the test strip</FormLabel>
              <Input onChange={handleImgChange} type="file" accept=".jpg" />
              <FormHelperText color="gray.500">In .JPG format</FormHelperText>
            </FormControl>
            <Button
              type="submit"
              onClick={handleSubmit}
              width="full"
              bg="blue.700"
              color="white"
              _hover={{ bg: "blue.800" }}
            >
              Analyze!
            </Button>
          </VStack>

          <Box
            width="full"
            maxWidth="600px"
            mt="2rem"
            p="2rem"
            bg="gray.700"
            border="2px solid white"
            borderRadius="10px"
          >
            <Center mb={4}>
              <Heading as="h4" size="md" color="white">
                Color Strip
              </Heading>
            </Center>
            <HStack justifyContent="center" spacing={1}>
              {stripBuilder()}
            </HStack>
          </Box>

          <Box
            width="full"
            maxWidth="600px"
            mt="2rem"
            p="2rem"
            bg="gray.700"
            border="2px solid white"
            borderRadius="10px"
          >
            <Heading as="h4" size="md" color="white" mb={4}>
              JSON Output
            </Heading>
            <Divider mb={4} />
            <Box color="white">{jsonList()}</Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Home;
