import React , {useState} from 'react';
import { VStack } from '@chakra-ui/layout';
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input,InputGroup,InputRightElement } from '@chakra-ui/input';
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios"; 
import { useHistory } from 'react-router-dom'; 

const Signup = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            
            toast({
                title: "please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png" || pics.type==="image/jpg") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dh2bmg9hi");
            fetch("https://api.cloudinary.com/v1_1/dh2bmg9hi/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    //console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
           
        } else {
            toast({
                title: "please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        
            setLoading(false);
            return;
        }
     };

    const submitHandler = async () => { 
        setLoading(true);
        if (!name || !email || !password || !confirmpassword)
        {
            toast({
                title: "Please enter all the fields ",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "password do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers: {
                   "Content-type" : "application/json",
                },
            };
            const { data } = await axios.post("/api/user", { name, email, password, pic }, config); 
            
            toast({
                title: "Registration Successful",
                status: "sucess",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
  
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");

        } catch (error) {
               toast({
                title: "Error Occured!",
                description : error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                
               });
            console.log("hey everyone");
            setLoading(false);
        }
    };
     
    return <VStack spacing='5px' color={'black'}>
        <FormControl id='first-name' isRequired>
            <FormLabel>
                Name
            </FormLabel>
            <Input
                placeholder='Enter Your Name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input
                placeholder='Enter Your Email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup size="md">
                <Input
                type={ show ? "text" : "password"}
                placeholder='Enter Your Password'
                onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <button h="1.75rem" size="sm" onClick={handleClick} >
                     {show ? "Hide" : "Show"}
                  </button>
                </InputRightElement>

            </InputGroup>

        </FormControl>
                <FormControl id='password' isRequired>
            <FormLabel>
                Confirm Password
            </FormLabel>
            <InputGroup size="md">
                <Input
                type={ show ? "text" : "password"}
                placeholder='Confrim Password'
                onChange={(e)=>setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <button h="1.75rem" size="sm" onClick={handleClick} >
                     {show ? "Hide" : "Show"}
                  </button>
                </InputRightElement>

            </InputGroup>

        </FormControl>
  
        <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) =>postDetails(e.target.files[0])}
            />
        </FormControl>
        
        <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading = {loading}
        >
          Sign Up
        </Button>

    </VStack>;
};

export default Signup;