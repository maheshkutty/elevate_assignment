import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Card, Button, Select, ConfigProvider } from "antd";
import { AlignLeftOutlined, ShoppingFilled } from "@ant-design/icons"
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import './App.css';

const { Search } = Input;
const { Meta } = Card;

const allCat = [
  { value: 'All Category', label: 'All Category' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'men\'s clothing', label: 'Men\'s clothing' },
  { value: 'women\'s clothing', label: 'Women\'s clothing' },
  { value: 'jewelery', label: 'Jewelery' }
]

function App() {
  const [prd, setPrd] = useState({
    "electronic": [],
    "men's clothing": [],
    "jewelery": [],
    "women's clothing": []
  });
  const [selCat, setSelCat] = useState("All Category");

  const getAllProducts = async () => {
    let tempPrd = {
      "electronic": [],
      "men's clothing": [],
      "women's clothing": [],
      "jewelery": [],
    }
    let products = await axios.get("https://fakestoreapi.com/products");
    products = await products.data;
    products.forEach(item => {
      if (item.category === "electronic") {
        tempPrd["electronic"].push(item);
      } else if (item.category === "men's clothing") {
        tempPrd["men's clothing"].push(item);
      }
      else if (item.category === "women's clothing") {
        tempPrd["women's clothing"].push(item);
      } else if (item.category === "jewelery") {
        tempPrd["jewelery"].push(item);
      }
    })
    return tempPrd;
  }

  const updateAllProduct = async () => {
    let products = await getAllProducts();
    setPrd({ ...products });
  }

  const getProduct = async (value) => {
    setSelCat(value);
    if (value === "All Category") {
      updateAllProduct();
    } else {
      let products = await axios.get(`https://fakestoreapi.com/products/category/${value}`);
      products = await products.data;
      setPrd({ [value]: products })
    }
  }

  const onSearch = async (value) => {
    if (value !== "") {
      let tempPrd = [];
      let prdNew = await getAllProducts();
      let keys = Object.keys(prdNew);
      for (let key of keys) {
        let data = prdNew[key].filter(item =>
          item.title.toLowerCase().includes(value.toLowerCase())
        )
        tempPrd[key] = data;
      }
      setPrd({ ...tempPrd })
    }
    else {
      getProduct(selCat);
    }
  }

  useEffect(() => {
    updateAllProduct();
  }, [])

  return (
    <div>
      <Row className="bg_container" justify="center">
        <Col span={24} style={{ height: "32rem" }}>
          <Row className="header_section_top">
            <Col className="custom_menu">
              <ul>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Gift Ideas</a></li>
                <li><a href="#">New Releases</a></li>
                <li><a href="#">Today's Deals</a></li>
                <li><a href="#">Customer Service</a></li>
              </ul>
            </Col>
          </Row>
          <h1 className="logo_text">Eflyer</h1>
          <Row justify="center" align="middle" gutter={[32, 16]}>
            <Col>
              <AlignLeftOutlined className="icons" />
            </Col>
            <Col className="cathead">
              <ConfigProvider theme={{
                token: {
                  colorBgBase:"black",
                  colorTextBase:"white",
                  colorHighlight:"white",
                  controlItemBgActive:"blue",
                },
              }}>
                <Select
                  defaultValue="All Category"
                  style={{ width: 120, }}
                  onChange={getProduct}
                  options={allCat}
                />
              </ConfigProvider>
            </Col>
            <Col>

              <Select
                defaultValue="English"
                style={{ width: 120 }}
                options={[
                  { value: '1', label: 'English' },
                  { value: '2', label: 'Hindi' }
                ]}
              />
            </Col>
            <Col>
              <ShoppingFilled className="icons" />
              <span className="iconsText">Card</span>
            </Col>
            <Col>
              <ConfigProvider theme={{
                token: {
                  colorPrimary: '#f26522',
                },
              }}>
                <Search enterButton color="#f26522" placeholder="Search Product" onSearch={onSearch} style={{ width: 300 }} />
              </ConfigProvider>
            </Col>
          </Row>
          <Row className="imgText" justify="center" align="middle" gutter={[16]}>
            <Col span={24} style={{ textAlign: "center", color: "white", fontSize: "1.2rem" }}>
              <h1 style={{ marginBottom: 0 }}>Get Started</h1>
              <h1 style={{ marginTop: 0 }}>Your favourite Shopping</h1>
            </Col>
          </Row>
          <Row className="buynowsection" justify="center">
            <Button style={{ color: "white", backgroundColor: "#2b2a29" }} size="large">Buy Now</Button>
          </Row>
        </Col>
      </Row>
      <Row>
        {Object.keys(prd).map((key) => prd[key].length > 0 ?
          <Row justify="center">
            <Col>
              <h1 style={{ textTransform: "capitalize" }}>{key}</h1>
            </Col>
            <Col className="cardSection">
              <Swiper
                spaceBetween={20}
                modules={[Autoplay]}
                breakpoints={{
                  640: {
                    slidesPerView: 1
                  },
                  768: {
                    slidesPerView: 3
                  }
                }}
              >
                {prd[key].map((item) =>
                  <SwiperSlide key={item.id}>
                    <Card style={{ width: 240 }} cover={<img className="electronic_img" src={item.image} />}>
                      <Meta title={item.title} description={item.category}></Meta>
                      <h2 style={{ color: "#f26522" }}>$ {item.price}</h2>
                    </Card>
                  </SwiperSlide>
                )}
              </Swiper>
            </Col>
          </Row>
          : null
        )}
      </Row>
    </div>
  );
}

export default App;
