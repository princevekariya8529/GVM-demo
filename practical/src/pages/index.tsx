import React, { useEffect, useState } from "react";
import {
  Box, Button, Flex, Input, Select, SimpleGrid, Spinner, Stack, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { db } from "@/firebase/client";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { useRouter } from "next/router";

const Allproducts = () => {
  const [allproducts, setAllproducts] = useState<any>([]);
  const [spinner, setSpinner] = useState(true);
  const [searchText, setSearchText] = useState<any>();
  const [filterData, setFilterData] = useState([]);
  const [optionValue, setOptionValue] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login")
    }
  }, [])

  useEffect(() => {
    const fetchAllProducts = async () => {
      const productsQuery = collection(db, "storeProducts");
      onSnapshot(productsQuery, (productsSnapshot) => {
        const productsArr: any = [];
        productsSnapshot.docs.map(async (products) => {
          const productsdata = products.data();
          productsArr.push({ ...productsdata, id: products.id });
        });
        setAllproducts(productsArr);
        setFilterData(productsArr)
        setSpinner(false);
      });
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (optionValue == "high-to-low") {
      const supplierSub = query(
        collection(db, "storeProducts"),
        orderBy("price", "desc")
      );
      onSnapshot(supplierSub, (querySnapshot) => {
        const data: any = querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
        setFilterData(data);
      });
    } else if (optionValue == "low-to-high") {
      const supplierSub = query(
        collection(db, "storeProducts"),
        orderBy("price", "asc")
      );
      onSnapshot(supplierSub, (querySnapshot) => {
        const data: any = querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
        setFilterData(data);
      });
    } else {
      setFilterData(allproducts);
    }
  }, [optionValue])


  useEffect(() => {
    if (searchText) {
      const filterData: any = allproducts.filter((data: any) => data.productName.toLowerCase().includes(searchText));
      setFilterData(filterData)
    }
    if (searchText?.length === 0) {
      setFilterData(allproducts)
    }
  }, [searchText])

  const handleLogOut = () => {
    localStorage.removeItem("userId");
    router.push("/login")
  }

  return (
    <div>
      {spinner ? (
        <>
          <Flex direction="column" align="center" flex="1" mt={5} mb={5}>
            <Spinner />
          </Flex>
        </>
      ) : (
        <>
          <Box
            maxW="7xl"
            mx="auto"
            px={{ base: "4", md: "8", lg: "12" }}
            py={{ base: "6", md: "8", lg: "12" }}
          >
            <Flex justifyContent={"flex-end"} pb={3}>
              <Button width={100} onClick={onOpen}>Log Out</Button>
            </Flex>
            <Stack
              spacing={{ base: "6", md: "8", lg: "4" }}
            >
              <Flex gap={4}>
                <Input placeholder="Search Product" onChange={(e: any) => setSearchText(e.target.value)} />
                <Select placeholder='Select option' onChange={(e) => setOptionValue(e.target.value)}>
                  <option value='high-to-low'>high-to-low</option>
                  <option value='low-to-high'>low-to-high</option>
                </Select>
              </Flex>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 4, lg: 4 }}
                gap={{ base: "8", lg: "10" }}
              >
                {filterData && filterData.map((product: any, index: number) => {
                  return <ProductCard
                    key={index}
                    product={product}
                  />;
                })}
              </SimpleGrid>
            </Stack>
          </Box>
          <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Please Confirm To Log Out</ModalHeader>
              <ModalCloseButton />
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={() => handleLogOut()}>
                  Log Out
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Allproducts;
