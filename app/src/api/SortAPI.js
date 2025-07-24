import axios from "axios";

export const SortAPI = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getNewProductsByPagination = async ({
  category,
  cursor,
  totalPage,
}) => {
  const response = await SortAPI.get("/api/sort/product/new", {
    params: {
      category: category,
      cursor: cursor,
      totalPage: totalPage,
    },
  });

  return response.data;
};

export const getDictionaryProductsByPagination = async ({
  category,
  cursor,
  totalPage,
}) => {
  const response = await SortAPI.get("/api/sort/product/dictionary", {
    params: {
      category: category,
      cursor: cursor,
      totalPage: totalPage,
    },
  });

  return response.data;
};

export const getCheaperProductsByPagination = async ({
  category,
  cursor,
  totalPage,
}) => {
  const response = await SortAPI.get("/api/sort/product/cheaper", {
    params: {
      category: category,
      cursor: cursor,
      totalPage: totalPage,
    },
  });

  return response.data;
};

export const getExpensiveProductsByPagination = async ({
  category,
  cursor,
  totalPage,
}) => {
  const response = await SortAPI.get("/api/sort/product/expensive", {
    params: {
      category: category,
      cursor: cursor,
      totalPage: totalPage,
    },
  });

  return response.data;
};

export const getBestProductsByPagination = async ({
  category,
  cursor,
  totalPage,
}) => {
  const response = await SortAPI.get("/api/sort/product/best", {
    params: {
      category: category,
      cursor: cursor,
      totalPage: totalPage,
    },
  });

  return response.data;
};
