import {
  AspectRatio,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  product: any;
}

export const ProductCard = (props: any) => {
  const { product } = props;
  const router = useRouter()
  console.log("product=============>", product)

  return (
    <Stack
      spacing="3"
      _hover={{
        outline: "3px solid rgba(0, 0, 0, 0.05)",
        borderRadius: "4px",
      }}
      onClick={() => router.push(`/productdetails/${product.id}`)}
    >
      <Box position="relative" className="group">
        <AspectRatio ratio={1} className="productCard" cursor={"pointer"}>
          <Image
            src={product.productImage}
            alt={product.productImage}
            width={100}
            height={100}
            draggable="false"
            unoptimized
          />
        </AspectRatio>
      </Box>
      <Stack spacing="1" textAlign={"center"}>
        <Text letterSpacing={"0.04em"} fontSize={"lg"}>
          {product.productName}
        </Text>
        <Text>{product.productDescription}</Text>
        <Text>${product.price}</Text>
      </Stack>
    </Stack>
  );
};
