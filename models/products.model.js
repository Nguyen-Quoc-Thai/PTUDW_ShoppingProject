var products = [
  {
    id: "mobile-1",
    name: "Samsung Galaxy J7 Prime",
    type: "mobile",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://salt.tikicdn.com/cache/w444/ts/product/1f/0d/0a/ade75e655133518889217408afd9c548.jpg",
      "https://thanhdatmobile.vn/timthumb.php?src=upload/images/samsung-galaxy-j7-prime.jpg&w=500&h=0&zc=1&a=tc",
      "https://static.quickmobileshop.com/cs-photos/products/original/galaxy-j7-prime-dual-sim-16gb-lte-4g-auriu-3gb-ram_10018509_5_1502267212.jpg",
    ],
  },
  {
    id: "mobile-2",
    name: "Samsung Galaxy S20 Ultra",
    type: "mobile",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "data:image/jpeg;base64,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",
      "https://c.ndtvimg.com/2020-02/ve19lu0o_gadgets-360_640x480_13_February_20.jpg?downsize=600:450",
      "https://cdn.pocket-lint.com/r/s/1200x630/assets/images/151169-phones-deals-the-best-samsung-galaxy-s20-ultra-5g-pre-order-deals-image1-l2inxbnufx.jpg",
    ],
  },
  {
    id: "mobile-3",
    name: "Redmi Note 8",
    type: "mobile",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://static.quickmobileshop.com/cs-photos/products/original/galaxy-j7-prime-dual-sim-16gb-lte-4g-auriu-3gb-ram_10018509_5_1502267212.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSX36kf4g9be2FYiYnmX1kDLzT9ZbbZkvYq4g&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSi0JQhTABTsK7KAW92TAjvnMNX4xF7j7SPFA&usqp=CAU",
    ],
  },
  {
    id: "mobile-4",
    name: "OPPO F11 Pro",
    type: "mobile",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://assorted.downloads.oppo.com/static/archives/images/dd/Smartphones/F11%20Pro/13-Smartphone-Detail-Page---Exterior.jpg",
      "https://media3.scdn.vn/img3/2019/5_27/ibZbaH_simg_de2fe0_500x500_maxb.jpg",
      "https://www.slashgear.com/wp-content/uploads/2019/03/oppof11pro_front.jpg",
    ],
  },
  {
    id: "laptop-1",
    name: "Laptop gaming Acer Nitro 5 AN515 55 77P9",
    type: "laptop",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSsm8pKdA3MuEy3QALDBAy3Q3MxZK9eIIJukgeU26FI4TQw9yc8jQ&usqp=CAc",
      "https://hanoicomputercdn.com/media/product/53839_nitro5__2_.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRocwr-U_zGt8Hs2tj8VsA117UKVQGfhcvSAQ&usqp=CAU",
    ],
  },
  {
    id: "laptop-2",
    name: "Laptop gaming Acer Aspire 7 A715 41G R150",
    type: "laptop",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000026716/product/11111_6dff57ef0cb541659292c2fa7405dbbe.jpg",
      "https://product.hstatic.net/1000233206/product/acer-aspire-7-a715-41g-r1az_1af959f673734393b59b09d9c9f69945_large.jpg",
      "https://anphat.com.vn/media/product/34886_acer_gaming_aspire_7_a715_41g_r150_nh_q8ssv_004.jpg",
      "data:image/jpeg;base64,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",
    ],
  },
  {
    id: "laptop-3",
    name: "Laptop gaming ASUS ROG Strix G G531GT HN553T",
    type: "laptop",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000026716/product/hn553t_5db99f5af11249ab800eb54a1e4d0c8b_large.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQgE-vk2X5LIBPbVZO5CAdhER-y_o6FxIQPfg&usqp=CAU",
      "https://fs.lnwfile.com/61vuis.jpg",
    ],
  },
  {
    id: "laptop-4",
    name: "Laptop Lenovo IdeaPad Gaming 3 15IMH05 81Y40067VN",
    type: "laptop",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000026716/product/67vn_9985e4884e95422daf90d916d54f3fe2_large.png",
      "https://tmp.tozi.media/wp-content/uploads/2020/09/1-8-1.jpg",
      "https://cdn.cellphones.com.vn/media/catalog/product/3/_/3_48_24_1.jpg",
      "https://timhangcongnghe.com/uploads/erp/products/product_image/image_url/141654/thumb445_Lenovo_Legion_5P_15IMH05_1.jpg",
    ],
  },
  {
    id: "computer-1",
    name: "DELL PRECISION T3610 FOR GAME & VIDEO",
    type: "computer",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000077174/product/t3610_0cc6a44b38ac4500ae2032233fb073fb.png",
      "https://product.hstatic.net/1000077174/product/1e2a4333_d6c7c7f5dfa6441581eaa12da7e7642c.jpg",
      "https://product.hstatic.net/1000077174/product/ghb_6910_4fc81b2b294f4165b2d1bc2f72ca0d2a.jpg",
    ],
  },
  {
    id: "computer-2",
    name: "DELL PRECISION T5810 FOR GAME & VIDEO",
    type: "computer",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000077174/product/t5810_364ae40c989347e4ae90372e33323110.png",
      "https://product.hstatic.net/1000077174/product/1e2a4333_68a533df5938401db8638e1f8a293cae.jpg",
      "https://product.hstatic.net/1000077174/product/img_0231_9568597b9f504a0d80a00c2c95d3796c.png",
      "https://product.hstatic.net/1000077174/product/img_0222_1bfdc7c0864e4f35a7f4f3837cffae0c.png",
    ],
  },
  {
    id: "computer-3",
    name: "ALIENWARE X51 R3",
    type: "computer",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000077174/product/1e2a5986_c0bdc885e7914d4bab514f5942eef1ca.jpg",
      "https://product.hstatic.net/1000077174/product/cut_alien_5_26f6d610c4684cef8d6cb36634a7b4f1.jpg",
      "https://product.hstatic.net/1000077174/product/cut_alien_4_32a26475a9b4408f9d57c1e770cd87be.jpg",
      "https://product.hstatic.net/1000077174/product/cut_alien_3_1aa0a6fe3ce747e5bb0190f37abb9cf8.jpg",
    ],
  },
  {
    id: "computer-4",
    name: "ALIENWARE AURORA ALX",
    type: "computer",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000077174/product/ghb_5191.jpg",
      "https://product.hstatic.net/1000077174/product/ghb_5196.jpg",
      "https://product.hstatic.net/1000077174/product/ghb_5167.jpg",
    ],
  },
  {
    id: "accessory-1",
    name: "Balo RAZER ROUGE BACKPACK ( 13.3 Inch )",
    type: "accessory",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000026716/product/gearvn_rouge_13_large.jpg",
      "https://momoshop.com.vn/wp-content/uploads/2019/10/Balo-Razer-Rouge-Backpack-Thoi-Trang-Momoshop.jpg",
    ],
  },
  {
    id: "accessory-2",
    name: "Balo RAZER ROUGE BACKPACK ( 13.3 Inch )",
    type: "accessory",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000026716/product/2689_1_f3ab8f681d62424ab4c6f6061731aa01.jpg",
      "https://www.mainguyen.vn/img/2018/08/product/colors/l/Cheero-Power-Plus-3-10050mAh-CHE-072-2.jpg",
    ],
  },
  {
    id: "accessory-3",
    name: "Thiết bị stream Microphone Elgato Wave 1",
    type: "accessory",
    basePrice: 280,
    salePrice: 200,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In condimentum quam ac mi viverra dictum. In efficitur ipsum diam, at dignissim lorem tempor in. Vivamus tempor hendrerit finibus. Nulla tristique viverra nisl, sit amet bibendum ante suscipit non. Praesent in faucibus tellus, sed gravida lacus. Vivamus eu diam eros. Aliquam et sapien eget arcu rhoncus scelerisque. Suspendisse sit amet neque neque. Praesent suscipit et magna eu iaculis. Donec arcu libero, commodo ac est a, malesuada finibus dolor. Aenean in ex eu velit semper fermentum. In leo dui, aliquet sit amet eleifend sit amet, varius in turpis. Maecenas fermentum ut ligula at consectetur. Nullam et tortor leo.",
    thumbnail: [
      "https://product.hstatic.net/1000026716/product/8_3d6093e60c54413b8b9dc0f7e997ed8b_large.jpg",
      "https://lagihitech.vn/wp-content/uploads/2020/09/Thi%E1%BA%BFt-b%E1%BB%8B-Stream-Microphone-Elgato-Wave-1-10MAA99014.jpg",
    ],
  },
];

module.exports = products;
