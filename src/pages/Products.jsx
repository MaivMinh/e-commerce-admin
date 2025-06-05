import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Image,
  Modal,
  Input,
  Select,
  Form,
  Popconfirm,
  Upload,
  Tabs,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import apiClient from "../services/apiClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add', 'edit', 'view'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [productVariants, setProductVariants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [fileList, setFileList] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [coverImageURL, setCoverImageURL] = useState("");
  const [additionalImageURLs, setAdditionalImageURLs] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const productsResponse = await apiClient.get("/api/products");
        const data = productsResponse.data.data;

        const formattedProducts = data.products.map((product) => ({
          ...product,
          categoryId: product.categoryId,
          isBestseller: product.isBestseller,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          cover: product.cover || "https://via.placeholder.com/150",
          images: product.images || [],
        }));

        setProducts(formattedProducts);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setSize(data.size);
        setPage(data.page);

        const categoriesResponse = await apiClient.get("/api/categories");
        setCategories(categoriesResponse.data.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showModal = (type, product = null) => {
    setModalType(type);
    setCurrentProduct(product);
    setVisible(true);
    setActiveTab("1");

    if (type === "edit" || type === "view") {
      form.setFieldsValue({
        id: product.id,
        name: product.name,
        slug: product.slug,
        cover: product.cover,
        images: product.images || [],
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        status: product.status,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        isBestseller: product.isBestseller,
        categoryId: product.categoryId,
      });

      // Mock variants
      setProductVariants([
        {
          id: "1",
          product_id: product.id,
          size: "M",
          color_name: "Red",
          color_hex: "#ff0000",
          price: product.price,
          original_price: product.original_price,
          quantity: 100,
          sku: `${product.slug}-M-RED`,
        },
        {
          id: "2",
          product_id: product.id,
          size: "L",
          color_name: "Blue",
          color_hex: "#0000ff",
          price: product.price + 5,
          original_price: product.original_price + 5,
          quantity: 80,
          sku: `${product.slug}-L-BLUE`,
        },
      ]);

      // Mock image data
      setFileList([
        {
          uid: "1",
          name: "cover.png",
          status: "done",
          url: product.cover,
        },
      ]);

      // Format additional images properly
      setAdditionalImages(
        (product.images || []).map((image, index) => ({
          uid: `additional-${index}`,
          name: `image-${index}.png`,
          status: "done",
          url: image,
        }))
      );
    } else {
      form.resetFields();
      setFileList([]);
      setAdditionalImages([]);
      setProductVariants([]);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    variantForm.resetFields();
    setFileList([]);
    setAdditionalImages([]);
    setCoverImageURL("");
    setAdditionalImageURLs([]);
  };

  // Custom upload handler for cover image
  const customUploadCover = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post(
        "/api/files/images/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = response.data.url;
      setCoverImageURL(imageUrl);
      onSuccess(response, file);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      message.error("Failed to upload cover image");
      onError(error);
    }
  };

  // Custom upload handler for additional images
  const customUploadAdditional = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiClient.post(
        "/api/files/images/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = response.data.url;
      setAdditionalImageURLs((prev) => [...prev, imageUrl]);
      onSuccess(response, file);
    } catch (error) {
      console.error("Error uploading additional image:", error);
      message.error("Failed to upload additional image");
      onError(error);
    }
  };

  // Handler for removing an additional image
  const handleRemoveAdditionalImage = (file) => {
    const index = additionalImages.findIndex((item) => item.uid === file.uid);
    if (index > -1) {
      const newUrls = [...additionalImageURLs];
      newUrls.splice(index, 1);
      setAdditionalImageURLs(newUrls);
    }
    return true;
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          setLoading(true);

          const formattedVariants = productVariants.map((variant) => ({
            size: variant.size,
            colorName: variant.color_name,
            colorHex: variant.color_hex,
            price: parseFloat(variant.price),
            originalPrice: parseFloat(
              variant.original_price || variant.originalPrice || 0
            ),
            quantity: parseInt(variant.quantity),
          }));

          // Create product data with image URLs
          const productData = {
            ...values,
            cover: coverImageURL,
            images: additionalImageURLs,
            productVariants: formattedVariants,
          };

          console.log(productData);

          // Send the data to your API
          const response = await apiClient.post("/api/products", productData, {
            headers: { "Content-Type": "application/json" },
          });

          message.success(
            `Product ${modalType === "add" ? "added" : "updated"} successfully!`
          );
          setVisible(false);

          // Refresh the products list
          fetchData();
        } catch (error) {
          console.error("Error saving product:", error);
          message.error("Failed to save product");
        } finally {
          setLoading(false);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDelete = (id) => {
    // Delete logic would go here
    setProducts(products.filter((product) => product.id !== id));
    message.success("Product deleted successfully!");
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // In a real app, you'd filter products based on search or make an API call
  };

  const handleAddVariant = () => {
    variantForm
      .validateFields()
      .then((values) => {
        // Create variant with properly formatted field names
        const newVariant = {
          id: Date.now().toString(), // Temporary ID for demo purposes
          size: values.size,
          colorName: values.color_name,
          colorHex: values.color_hex,
          price: values.price,
          originalPrice: values.originalPrice,
          quantity: values.quantity,
        };
        setProductVariants([...productVariants, newVariant]);
        variantForm.resetFields();
        message.success("Variant added successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDeleteVariant = (variantId) => {
    setProductVariants(productVariants.filter((v) => v.id !== variantId));
    message.success("Variant deleted successfully!");
  };


  const columns = [
    {
      title: "Image",
      dataIndex: "cover",
      key: "cover",
      render: (cover) => <Image src={cover} width={50} height={50} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text} VND`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "category",
      render: (categoryId) => {
        const category = categories.find((c) => c.id === categoryId);
        return category ? category.name : "Không xác định";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "inactive") color = "volcano";
        if (status === "out_of_stock") color = "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Features",
      key: "features",
      render: (_, record) => (
        <Space>
          {record.isFeatured && <Tag color="purple">Featured</Tag>}
          {record.isNew && <Tag color="blue">New</Tag>}
          {record.isBestseller && <Tag color="orange">Bestseller</Tag>}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showModal("view", record)}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal("edit", record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const variantColumns = [
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Color",
      dataIndex: "colorName",
      key: "color_name",
      render: (text, record) => (
        <Space>
          <div
            style={{
              backgroundColor: record.colorHex,
              width: 20,
              height: 20,
              display: "inline-block",
              marginRight: 8,
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
            }}
          />
          {text}
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this variant?"
            onConfirm={() => handleDeleteVariant(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Products</Title>
        <Space>
          <Input
            placeholder="Search products"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal("add")}
          >
            Add Product
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={
          modalType === "add"
            ? "Add New Product"
            : modalType === "edit"
            ? "Edit Product"
            : "View Product"
        }
        visible={visible}
        onCancel={handleCancel}
        footer={
          modalType === "view"
            ? [
                <Button key="back" onClick={handleCancel}>
                  Close
                </Button>,
              ]
            : [
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  {modalType === "add" ? "Create" : "Update"}
                </Button>,
              ]
        }
        width={800}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Basic Info" key="1">
            <Form form={form} layout="vertical" disabled={modalType === "view"}>
              <Form.Item
                name="name"
                label="Product Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="slug"
                label="Slug"
                rules={[
                  { required: true, message: "Please enter product slug" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select a category">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Please enter price" }]}
                  >
                    <Input type="number" suffix=" VND" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="originalPrice"
                    label="Original price"
                    rules={[
                      {
                        required: true,
                        message: "Please enter original price",
                      },
                    ]}
                  >
                    <Input type="number" suffix=" VND" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="out_of_stock">Out of Stock</Option>
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="isFeatured" label="Featured Status">
                    <Select>
                      <Option value={true}>Featured</Option>
                      <Option value={false}>Not Featured</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="isNew" label="New Product">
                    <Select>
                      <Option value={true}>New</Option>
                      <Option value={false}>Not New</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="isBestseller" label="Bestseller Status">
                    <Select>
                      <Option value={true}>Bestseller</Option>
                      <Option value={false}>Not Bestseller</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          <TabPane tab="Images" key="2">
            <div className="mb-8">
              <Title level={5}>Cover Image</Title>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                customRequest={customUploadCover}
                maxCount={1}
                disabled={modalType === "view"}
                onRemove={() => {
                  setCoverImageURL("");
                  return true;
                }}
              >
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>

            <div>
              <Title level={5}>Additional Images (Up to 4)</Title>
              <Upload
                listType="picture-card"
                fileList={additionalImages}
                onChange={({ fileList }) => setAdditionalImages(fileList)}
                customRequest={customUploadAdditional}
                maxCount={4}
                multiple
                disabled={modalType === "view"}
                onRemove={handleRemoveAdditionalImage}
              >
                {additionalImages.length < 4 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          </TabPane>

          <TabPane tab="Variants" key="3">
            <div className="mb-4">
              <Title level={5}>Product Variants</Title>
              <Table
                columns={variantColumns}
                dataSource={productVariants}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </div>

            {modalType !== "view" && (
              <div className="mt-4 pt-4 border-t">
                <Title level={5}>Add New Variant</Title>
                <Form form={variantForm} layout="vertical">
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="size"
                        label="Size"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Select size">
                          <Option value="S">S</Option>
                          <Option value="M">M</Option>
                          <Option value="L">L</Option>
                          <Option value="XL">XL</Option>
                          <Option value="XXL">XXL</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="color_name"
                        label="Color Name"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="color_hex"
                        label="Color Hex"
                        rules={[{ required: true }]}
                      >
                        <Input type="color" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true }]}
                      >
                        <Input type="number" suffix=" VND" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="originalPrice" label="Original Price">
                        <Input type="number" suffix=" VND" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true }]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Button type="primary" onClick={handleAddVariant}>
                    Add Variant
                  </Button>
                </Form>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Products;
