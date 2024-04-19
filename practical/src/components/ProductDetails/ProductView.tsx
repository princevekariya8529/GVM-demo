import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export const ProductView = () => {
    const router = useRouter();
    const { productId }: any = router.query;
    const [productData, setProductData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchStoreDetail = async () => {
            const productRef = doc(db, "storeProducts", productId);
            const docData = await getDoc(productRef)
            if (docData.exists()) {
                return { ...docData.data(), id: docData.id }
            }
        };

        if (productId) {
            (async () => {
                const productResponse = await fetchStoreDetail();
                console.log("productResponse==============>", productResponse)
                setProductData(productResponse);
                setLoading(false);
            })();
        }
    }, [productId]);

    if (loading) {
        return (
            <Box
                maxW="7xl"
                mx="auto"
                px={{ base: "4", md: "8", lg: "12" }}
                py={{ base: "6", md: "8", lg: "12" }}
                marginTop={10}
                marginBottom={10}
                outline={"3px solid rgba(0, 0, 0, 0.05)"}
            >
                <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
                    <Spinner />
                </Flex>
            </Box>
        )
    }

    return (
        <Box
            maxW="7xl"
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "12" }}
            marginTop={10}
            marginBottom={10}
            outline={"3px solid rgba(0, 0, 0, 0.05)"}
        >
            <Stack
                display={"flex"}
                gap={{ base: "2rem", md: '5rem' }}
                flexDirection={{ base: "column-reverse", lg: "row" }}
                justifyContent={"space-between"}
            >
                <Stack
                    direction={{ base: "column-reverse", lg: "row" }}
                    spacing={{ base: "6", lg: "12", xl: "16" }}
                    width={{ base: "auto", lg: "50%" }}
                >
                    <Stack
                        spacing={{ base: "6", lg: "8" }}
                        justify="center"
                    >
                        <Stack spacing={{ base: "3", md: "4" }}>
                            <Stack spacing="3">
                                <Heading>
                                    {productData?.productName}
                                </Heading>
                            </Stack>
                            <Text fontSize={"sm"}>
                                {productData?.productDescription}
                            </Text>
                            <Text>${productData?.price}</Text>
                        </Stack>
                    </Stack>
                </Stack>
                <Image src={productData?.productImage} alt="" width={500} height={500} />
            </Stack>
        </Box>
    )
}