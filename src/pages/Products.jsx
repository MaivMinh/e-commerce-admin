import React, { useState, useEffect } from 'react';
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
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
  const [productVariants, setProductVariants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [fileList, setFileList] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'Modern T-Shirt',
          slug: 'modern-t-shirt',
          description: 'A comfortable modern t-shirt',
          cover_image: 'https://via.placeholder.com/150',
          price: 29.99,
          original_price: 39.99,
          status: 'active',
          is_featured: true,
          is_new: true,
          is_bestseller: false,
          category_id: '1',
          created_at: '2023-05-15',
          created_by: 'admin',
          category: { name: 'Clothing' }
        },
        {
          id: '2',
          name: 'Classic Jeans',
          slug: 'classic-jeans',
          description: 'High quality denim jeans',
          cover_image: 'https://via.placeholder.com/150',
          price: 59.99,
          original_price: 79.99,
          status: 'active',
          is_featured: true,
          is_new: false,
          is_bestseller: true,
          category_id: '1',
          created_at: '2023-05-10',
          created_by: 'admin',
          category: { name: 'Clothing' }
        },
        {
          id: '3',
          name: 'Wireless Headphones',
          slug: 'wireless-headphones',
          description: 'High quality sound with noise cancellation',
          cover_image: 'https://via.placeholder.com/150',
          price: 199.99,
          original_price: 249.99,
          status: 'out_of_stock',
          is_featured: false,
          is_new: true,
          is_bestseller: false,
          category_id: '2',
          created_at: '2023-05-05',
          created_by: 'admin',
          category: { name: 'Electronics' }
        },
      ]);
      
      setCategories([
        { id: '1', name: 'Clothing', parent_id: null },
        { id: '2', name: 'Electronics', parent_id: null },
        { id: '3', name: 'T-shirts', parent_id: '1' },
        { id: '4', name: 'Jeans', parent_id: '1' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const showModal = (type, product = null) => {
    setModalType(type);
    setCurrentProduct(product);
    setVisible(true);
    setActiveTab('1');
    
    if (type === 'edit' || type === 'view') {
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        status: product.status,
        is_featured: product.is_featured,
        is_new: product.is_new,
        is_bestseller: product.is_bestseller,
        category_id: product.category_id,
      });
      
      // Mock variants
      setProductVariants([
        {
          id: '1',
          product_id: product.id,
          size: 'M',
          color_name: 'Red',
          color_hex: '#ff0000',
          price: product.price,
          original_price: product.original_price,
          quantity: 100,
          sku: `${product.slug}-M-RED`
        },
        {
          id: '2',
          product_id: product.id,
          size: 'L',
          color_name: 'Blue',
          color_hex: '#0000ff',
          price: product.price + 5,
          original_price: product.original_price + 5,
          quantity: 80,
          sku: `${product.slug}-L-BLUE`
        },
      ]);
      
      // Mock image data
      setFileList([
        {
          uid: '-1',
          name: 'cover.png',
          status: 'done',
          url: product.cover_image,
        },
      ]);
      
      setAdditionalImages([
        {
          uid: '-1',
          name: 'image1.png',
          status: 'done',
          url: 'https://via.placeholder.com/150',
        },
        {
          uid: '-2',
          name: 'image2.png',
          status: 'done',
          url: 'https://via.placeholder.com/150',
        },
      ]);
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
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        // Here you would normally send to backend
        console.log('Form values:', values);
        message.success(`Product ${modalType === 'add' ? 'added' : 'updated'} successfully!`);
        setVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (id) => {
    // Delete logic would go here
    setProducts(products.filter(product => product.id !== id));
    message.success('Product deleted successfully!');
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // In a real app, you'd filter products based on search or make an API call
  };

  const handleAddVariant = () => {
    variantForm.validateFields()
      .then(values => {
        // Add variant logic
        const newVariant = {
          id: Date.now().toString(),
          product_id: currentProduct?.id || 'new',
          ...values
        };
        setProductVariants([...productVariants, newVariant]);
        variantForm.resetFields();
        message.success('Variant added successfully!');
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteVariant = (variantId) => {
    setProductVariants(productVariants.filter(v => v.id !== variantId));
    message.success('Variant deleted successfully!');
  };

  const handleCoverImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleAdditionalImagesChange = ({ fileList }) => {
    setAdditionalImages(fileList);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'cover_image',
      key: 'cover_image',
      render: (text) => <Image src={text} width={50} height={50} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.name,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'inactive') color = 'volcano';
        if (status === 'out_of_stock') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Features',
      key: 'features',
      render: (_, record) => (
        <Space>
          {record.is_featured && <Tag color="purple">Featured</Tag>}
          {record.is_new && <Tag color="blue">New</Tag>}
          {record.is_bestseller && <Tag color="orange">Bestseller</Tag>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => showModal('view', record)}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal('edit', record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const variantColumns = [
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Color',
      dataIndex: 'color_name',
      key: 'color_name',
      render: (text, record) => (
        <Space>
          <div 
            style={{ 
              backgroundColor: record.color_hex, 
              width: 20, 
              height: 20, 
              display: 'inline-block',
              marginRight: 8,
              border: '1px solid #d9d9d9',
              borderRadius: '2px'
            }} 
          />
          {text}
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this variant?"
            onConfirm={() => handleDeleteVariant(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
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
            onClick={() => showModal('add')}
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
          modalType === 'add' ? 'Add New Product' : 
          modalType === 'edit' ? 'Edit Product' : 'View Product'
        }
        visible={visible}
        onCancel={handleCancel}
        footer={
          modalType === 'view' 
            ? [<Button key="back" onClick={handleCancel}>Close</Button>]
            : [
                <Button key="back" onClick={handleCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  {modalType === 'add' ? 'Create' : 'Update'}
                </Button>,
              ]
        }
        width={800}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Basic Info" key="1">
            <Form
              form={form}
              layout="vertical"
              disabled={modalType === 'view'}
            >
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Please enter product slug' }]}
              >
                <Input />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              
              <Form.Item
                name="category_id"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Select a category">
                  {categories.map(category => (
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
                    rules={[{ required: true, message: 'Please enter price' }]}
                  >
                    <Input type="number" prefix="$" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="original_price"
                    label="Original Price"
                  >
                    <Input type="number" prefix="$" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="out_of_stock">Out of Stock</Option>
                </Select>
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="is_featured"
                    valuePropName="checked"
                  >
                    <Select>
                      <Option value={true}>Featured</Option>
                      <Option value={false}>Not Featured</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="is_new"
                    valuePropName="checked"
                  >
                    <Select>
                      <Option value={true}>New</Option>
                      <Option value={false}>Not New</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="is_bestseller"
                    valuePropName="checked"
                  >
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
                onChange={handleCoverImageChange}
                beforeUpload={() => false}
                maxCount={1}
                disabled={modalType === 'view'}
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
                onChange={handleAdditionalImagesChange}
                beforeUpload={() => false}
                maxCount={4}
                multiple
                disabled={modalType === 'view'}
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
            
            {modalType !== 'view' && (
              <div className="mt-4 pt-4 border-t">
                <Title level={5}>Add New Variant</Title>
                <Form
                  form={variantForm}
                  layout="vertical"
                >
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
                        <Input type="number" prefix="$" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="original_price"
                        label="Original Price"
                      >
                        <Input type="number" prefix="$" />
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
                  
                  <Form.Item
                    name="sku"
                    label="SKU"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  
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