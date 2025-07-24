import { sortProductByBest } from "../../api/ProductApi";

export const sortByNumberOrderByDESC = (products, property) => {
  return products.sort((a, b) => {
    const valueA = parseInt(a[property], 10);
    const valueB = parseInt(b[property], 10);

    if (valueA < valueB) return 1;
    if (valueA > valueB) return -1;

    return 0;
  });
};
export const sortByNumberOrderByASC = (products, property) => {
  return products.sort((a, b) => {
    const valueA = parseInt(a[property], 10);
    const valueB = parseInt(b[property], 10);

    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;

    return 0;
  });
};
export const sortByStringOrderByDESC = (products, property) => {
  return products.sort((a, b) => {
    const valueA = a[property];
    const valueB = b[property];

    if (valueA < valueB) return 1;
    if (valueA > valueB) return -1;

    return 0;
  });
};
export const sortByStringOrderByASC = (products, property) => {
  return products.sort((a, b) => {
    const valueA = a[property];
    const valueB = b[property];

    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;

    return 0;
  });
};

export const sortBestItemByProductId = async (filteredProducts) => {
  const selectProductId = filteredProducts.map((p) => p.id); // product.id 데이터만 가져옴
  const sortedIds = await sortProductByBest({ product: selectProductId });

  const sortedProduct = sortedIds.map((id) =>
    filteredProducts.find((p) => p.id === id.productId),
  ); // 기존 배열의 순서를 best 순으로 변경

  return sortedProduct;
};
