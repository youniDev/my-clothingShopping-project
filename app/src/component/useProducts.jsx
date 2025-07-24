import { useEffect, useState } from "react";
import { getBestProductByCategory } from "../api/ProductApi";
import { ERROR } from "../assets/js/Constants";

/**
 * 제품 초기 정보 저장
 * @param {*} mainCategory
 * @returns
 */
const useProducts = (mainCategory) => {
  const [page, setPage] = useState({ cursor: null, totalPage: null });
  const [products, setProducts] = useState([]);
  const [bestItems, setBestItems] = useState([]);

  useEffect(() => {
    initProducts();
  }, [mainCategory]);

  /**
   * 1029 pagination 최적화 중
   * 각 카테고리 별 베스트 상품 초기화
   */
  const initProducts = async () => {
    try {
      const data = await getBestProductByCategory({ category: mainCategory });

      setProducts([]);
      showBestItem(data.products);

      setPage({ cursor: null, totalPage: data.totalPage });
    } catch (error) {
      console.error(ERROR.FAIL_COMMUNICATION, error);
    }
  };

  // best item 정보 불러오기
  const showBestItem = async (updateProduct) => {
    try {
      if (updateProduct == null) {
        console.error(ERROR.NON_PRODUCT);
        return;
      }

      setBestItems(updateProduct);
    } catch (error) {
      if (error === Notification) {
        console.log(ERROR.NON_PRODUCT);
        return;
      }

      console.error(ERROR.FAIL_COMMUNICATION, error);
    }
  };

  return { products, setProducts, bestItems, page };
};

export default useProducts;

/**     
 *  paginationProduct
    /*
    const showProductByPage = async () => {
        try {
            const newProducts = await getProductByPagination({category: mainCategory, cursor, totalPage});
            
            setCursor(newProducts.nextCursor);
            setFilteredProducts(prevProducts => [...prevProducts, ...newProducts.products]);
            
            //setFilteredProducts(filtered.products);

        } catch(error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }

    제품 정보 불러오기
    const showProductListBefore = async () => {
        try {
            const filtered = await getFileByCategory({category: mainCategory});

            setFilteredProducts(filtered);
            showBestItem(filtered);
            
        } catch(error) {
            console.error(ERROR.FAIL_COMMUNICATION, error);
        }
    }
    */
