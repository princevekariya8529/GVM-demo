import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/firebase/client';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const SignUP = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const onClickReveal = () => {
        onToggle();
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    };

    type Inputs = {
        name: string;
        email: string;
        password: string;
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("Name is required")
            .matches(
                /[abcdefghijklmnopqrstuvwxyz]+/,
                "Please enter valid name"
            ),
        email: Yup.string()
            .required("Email is required")
            .label("email")
            .email("enter valid email")
            .matches(
                /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                "enter valid email"
            ),
        password: Yup.string()
            .required("password is required")
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: yupResolver<any>(validationSchema),
    });

    const auth = getAuth();
    const onSubmit: SubmitHandler<Inputs> = async (values: Inputs) => {
        setIsLoading(true);

        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user) {
                    const usid = user.uid;
                    const ref = doc(db, "storeUsers", usid);
                    setDoc(ref, {
                        id: usid,
                        email: values.email,
                        name: values.name,
                    })
                }
                localStorage.setItem("userId", user.uid);
                toast.success("Register Successfully");
                setIsLoading(false);
                router.push("/");
            })
            .catch((error) => {
                setIsLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorCode.split('/')[1]);
            });
    }

    return (
        <Container maxW="md" py={{ base: '12', md: '24' }}>
            <Stack spacing="8">
                <Stack spacing="6" align="center">
                    <Stack spacing="3" textAlign="center">
                        <Heading size={{ base: 'xs', md: 'sm' }}>Register</Heading>
                    </Stack>
                </Stack>
                <Stack spacing="6">
                    <form
                        id="create-store-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Stack spacing="5">
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <Input id="name" type="text"
                                    {...register("name")}
                                    mb={!!errors.name ? 0 : 3}
                                    placeholder="enter name"
                                />
                                <FormErrorMessage>{errors.name && errors.name?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.email}>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input id="email"
                                    placeholder="email"
                                    {...register("email")}
                                    mb={!!errors.email ? 0 : 3}
                                />
                                <FormErrorMessage>{errors.email && errors.email?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.password}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <InputGroup>
                                    <InputRightElement>
                                        <IconButton
                                            variant="link"
                                            aria-label={
                                                isOpen ? "Mask password" : "Reveal password"
                                            }
                                            icon={isOpen ? <HiEyeOff /> : <HiEye />}
                                            onClick={onClickReveal}
                                        />
                                    </InputRightElement>
                                    <Input id="password"
                                        placeholder="enter password"
                                        {...register("password")}
                                        mb={!!errors.password ? 0 : 3}
                                        type={isOpen ? "text" : "password"}
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.password && errors.password?.message}</FormErrorMessage>
                                {/* <FormHelperText color="muted" mb={3}>Please enter password</FormHelperText> */}
                            </FormControl>
                        </Stack>
                        <Stack spacing="4">
                            <Button
                                type="submit"
                            >
                                <Text>{isLoading ? <Spinner /> : "Register"}</Text>
                            </Button>
                        </Stack>
                    </form>
                </Stack>
                <HStack justify="center" spacing="1">
                    <Text fontSize="sm" color="muted">
                        You have already account?
                    </Text>
                    <Link href={"/login"} color="primaryColor">
                        Login
                    </Link>
                </HStack>
            </Stack >
        </Container >
    )
}
export default SignUP;
