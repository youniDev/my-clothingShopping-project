import React, { useEffect, useRef } from "react";
import { getProductByPagination } from "../api/ProductApi";
import {
  getNewProductsByPagination,
  getDictionaryProductsByPagination,
  getCheaperProductsByPagination,
  getExpensiveProductsByPagination,
  getBestProductsByPagination,
} from "../api/SortAPI";

/**
 * 커서 기반 페이지네이션 구현
 */
export const useCursorPagination = (category, page, products, setProducts) => {
  const selectedCategory = useRef(category);
  const cursor = useRef(null);
  const sortType = useRef(null);
  const bottomRef = useRef(null); // 감지 요소
  const count = useRef(1);
  const hasMore = useRef(true);

  console.log("selected category is %s", category);

  const loadMoreProducts = async () => {
    if (!hasMore) {
      console.log("hasMore value : " + hasMore.current);
      return; // 더 로드할 제품이 없으면 종료
    }
    await loadProductsByScroll();
  };

  const loadProducts = async () => {
    let data = null;

    switch (sortType.current) {
      case "new":
        data = loadNewProducts();
        break;
      case "dictionary":
        data = loadDictionaryProducts();
        break;
      case "cheaper":
        data = loadCheaperProducts();
        break;
      case "expensive":
        data = loadExpensiveProducts();
        break;
      case "best":
        data = loadBestProducts();
        break;
      default:
        data = loadBasicProducts();
        break;
    }

    return await data;
  };

  const loadBasicProducts = async () => {
    const data = await getProductByPagination({
      category: selectedCategory.current,
      cursor: cursor.current,
      totalPage: page.totalPage,
    });

    return data;
  };

  const loadNewProducts = async () => {
    const data = await getNewProductsByPagination({
      category: selectedCategory.current,
      cursor: cursor.current,
      totalPage: page.totalPage,
    });

    return data;
  };

  const loadDictionaryProducts = async () => {
    const data = await getDictionaryProductsByPagination({
      category: selectedCategory.current,
      cursor: cursor.current,
      totalPage: page.totalPage,
    });

    return data;
  };

  const loadCheaperProducts = async () => {
    const data = await getCheaperProductsByPagination({
      category: selectedCategory.current,
      cursor: cursor.current,
      totalPage: page.totalPage,
    });

    return data;
  };

  const loadExpensiveProducts = async () => {
    const data = await getExpensiveProductsByPagination({
      category: selectedCategory.current,
      cursor: cursor.current,
      totalPage: page.totalPage,
    });

    return data;
  };

  const loadBestProducts = async () => {
    const data = await getBestProductsByPagination({
      category: selectedCategory.current,
      cursor: cursor.current,
      totalPage: page.totalPage,
    });

    return data;
  };

  // 정렬 시 마다 cursur와 보여지는 제품 초기화
  const selectSortType = (type) => {
    sortType.current = type;
    cursor.current = null;
    count.current = 1;
    setProducts([]);
  };

  const loadProductsByScroll = async () => {
    try {
      const data = await loadProducts();

      // 더 로드할 제품이 없을 경우
      if (!data) {
        console.log("has no more item");
        cursor.current = null; // 마지막 상품일 경우, 커서 초기화
        hasMore.current = false;
        return;
      }

      cursor.current = data.nextCursor;
      count.current += 1;

      setProducts((prevProducts) => [...prevProducts, ...data.products]);
    } catch (error) {
      console.error(error);
    }
  };

  // 카테고리가 변경될 때 마다 초기화
  useEffect(() => {
    count.current = 1;
    sortType.current = null;
    cursor.current = null;
    selectedCategory.current = category;
  }, [category]);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // init 전 show product 되는거 방지
        if (page.totalPage == null) {
          return;
        }
        // 마지막 페이지에서 더 검색 금지
        if (count.current > page.totalPage) {
          return;
        }
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 1.0 },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hasMore, page.totalPage]);

  return { bottomRef, products, selectSortType };
};
