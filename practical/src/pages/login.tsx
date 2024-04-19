import React, { useRef, useState } from "react";
import {
    Box,
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
} from "@chakra-ui/react";
import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onToggle } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);
    const onClickReveal = () => {
        onToggle();
        if (inputRef.current) {
            inputRef.current.focus({ preventScroll: true });
        }
    };
    const router = useRouter();

    type Inputs = {
        email: string;
        password: string;
    };

    const validationSchema = Yup.object().shape({
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

    const login: SubmitHandler<Inputs> = (values: Inputs) => {
        const auth = getAuth();
        setIsLoading(true);
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user: any = userCredential.user;
                localStorage.setItem("userId", user.uid);
                toast.success("Login successfully");
                setIsLoading(false);
                router.push("/");
            })
            .catch((error) => {
                setIsLoading(false);
                const errorCode = error.code;
                toast.error(errorCode.split('/')[1]);
            });
    }

    return (<>
        <Container
            maxW="lg"
            py={{ base: "12", md: "24" }}
            px={{ base: "0", sm: "8" }}
        >
            <Stack spacing="8">
                <Stack spacing="6">
                    <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
                        <Heading size={{ base: 'xs', md: 'sm' }}>
                            Login
                        </Heading>
                        <HStack spacing="1" justify="center">
                            <Text color="muted">Do not have account</Text>
                            <Link
                                href={"/register"}
                            >
                                Register
                            </Link>
                        </HStack>
                    </Stack>
                </Stack>
                <Box
                    py={{ base: "0", sm: "8" }}
                    px={{ base: "4", sm: "10" }}
                    bg={{ base: "transparent", sm: "bg-surface" }}
                    boxShadow={{ base: "none", sm: "md" }}
                    borderRadius={{ base: "none", sm: "xl" }}
                >
                    <form
                        onSubmit={handleSubmit(login)}
                    >
                        <Stack spacing="6">
                            <Stack spacing="5">
                                <FormControl isInvalid={!!errors.email}>
                                    <FormLabel htmlFor="email">
                                        Email
                                        <span style={{ color: "red" }}> *</span>
                                    </FormLabel>
                                    <Input id="email"
                                        placeholder="enter email"
                                        {...register("email")}
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
                                </FormControl>
                            </Stack>
                            <Stack spacing="6">
                                <Button
                                    type="submit"
                                >
                                    <Text>{isLoading ? <Spinner /> : "Login"}</Text>
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Container>
    </>);
};

export default Login;
