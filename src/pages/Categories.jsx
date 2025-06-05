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
  message,
  Tree
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  FolderOutlined,
  FolderAddOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [fileList, setFileList] = useState([]);
  const [treeData, setTreeData] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const mockCategories = [
        {
          id: '1',
          parent_id: null,
          name: 'Clothing',
          slug: 'clothing',
          description: 'All clothing items',
          image: 'https://via.placeholder.com/150',
          status: 'active',
          created_at: '2023-05-15',
          created_by: 'admin',
        },
        {
          id: '2',
          parent_id: null,
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronic devices and accessories',
          image: 'https://via.placeholder.com/150',
          status: 'active',
          created_at: '2023-05-10',
          created_by: 'admin',
        },
        {
          id: '3',
          parent_id: '1',
          name: 'T-shirts',
          slug: 't-shirts',
          description: 'All types of t-shirts',
          image: 'https://via.placeholder.com/150',
          status: 'active',
          created_at: '2023-05-08',
          created_by: 'admin',
        },
        {
          id: '4',
          parent_id: '1',
          name: 'Jeans',
          slug: 'jeans',
          description: 'Denim jeans for all',
          image: 'https://via.placeholder.com/150',
          status: 'inactive',
          created_at: '2023-05-05',
          created_by: 'admin',
        },
        {
          id: '5',
          parent_id: '2',
          name: 'Smartphones',
          slug: 'smartphones',
          description: 'Latest smartphones',
          image: 'https://via.placeholder.com/150',
          status: 'active',
          created_at: '2023-05-03',
          created_by: 'admin',
        },
      ];
      
      setCategories(mockCategories);
      
      // Convert flat list to tree structure for tree view
      const buildTreeData = (items, parentId = null) => {
        return items
          .filter(item => item.parent_id === parentId)
          .map(item => ({
            title: item.name,
            key: item.id,
            icon: <FolderOutlined />,
            children: buildTreeData(items, item.id),
          }));
      };
      
      setTreeData(buildTreeData(mockCategories));
      setLoading(false);
    }, 1000);
  }, []);

  const showModal = (type, category = null) => {
    setModalType(type);
    setCurrentCategory(category);
    setVisible(true);
    
    if (type === 'edit' || type === 'view') {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parent_id: category.parent_id,
        status: category.status,
      });
      
      // Set image
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: category.image,
        },
      ]);
    } else {
      form.resetFields();
      setFileList([]);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        // Here you would normally send to backend
        console.log('Form values:', values);
        message.success(`Category ${modalType === 'add' ? 'added' : 'updated'} successfully!`);
        setVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (id) => {
    // In a real app, you would check if the category has children before deleting
    // Here we're just removing from our local state
    setCategories(categories.filter(category => category.id !== id));
    message.success('Category deleted successfully!');
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // In a real app, you'd filter categories based on search or make an API call
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
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
      title: 'Parent Category',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (parentId) => {
        if (!parentId) return <Tag>Root Category</Tag>;
        const parent = categories.find(cat => cat.id === parentId);
        return parent ? parent.name : '';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'active' ? 'green' : 'volcano';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal('edit', record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this category?"
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Categories</Title>
        <Space>
          <Input 
            placeholder="Search categories" 
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showModal('add')}
          >
            Add Category
          </Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-1 bg-white p-4 rounded shadow">
          <Title level={4}>Category Tree</Title>
          <Tree
            showIcon
            defaultExpandAll
            treeData={treeData}
          />
        </div>
        
        <div className="md:col-span-3">
          <Table 
            columns={columns} 
            dataSource={categories} 
            rowKey="id"
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title={
          modalType === 'add' ? 'Add New Category' : 
          modalType === 'edit' ? 'Edit Category' : 'View Category'
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
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalType === 'view'}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Please enter category slug' }]}
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
            name="parent_id"
            label="Parent Category"
          >
            <Select placeholder="Select parent category" allowClear>
              <Option value={null}>Root Category</Option>
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="image"
            label="Category Image"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;