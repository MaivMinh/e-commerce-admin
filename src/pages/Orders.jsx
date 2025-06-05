import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Descriptions, 
  Badge,
  Input,
  Select,
  Form,
  Divider,
  Drawer,
  Row,
  Col,
  Card,
  Statistic,
  Timeline,
  message,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD-001',
          account_id: 'ACC-001',
          account_name: 'John Doe',
          shipping_address_id: 'ADDR-001',
          shipping_address: '123 Main St, Apt 4B, New York, NY 10001',
          status: 'pending',
          subtotal: 240.00,
          discount: 20.00,
          total: 220.00,
          payment_method_id: 'PM-001',
          payment_method: 'Credit Card',
          payment_status: 'pending',
          promotion_id: 'PROMO10',
          note: 'Please deliver to front desk',
          created_at: '2023-05-15T09:30:00',
          created_by: 'system',
          item_count: 3
        },
        {
          id: 'ORD-002',
          account_id: 'ACC-002',
          account_name: 'Jane Smith',
          shipping_address_id: 'ADDR-002',
          shipping_address: '456 Oak Ave, Seattle, WA 98101',
          status: 'completed',
          subtotal: 185.50,
          discount: 0,
          total: 185.50,
          payment_method_id: 'PM-002',
          payment_method: 'PayPal',
          payment_status: 'completed',
          promotion_id: null,
          note: null,
          created_at: '2023-05-14T14:20:00',
          created_by: 'system',
          item_count: 2
        },
        {
          id: 'ORD-003',
          account_id: 'ACC-003',
          account_name: 'Robert Johnson',
          shipping_address_id: 'ADDR-003',
          shipping_address: '789 Pine St, San Francisco, CA 94102',
          status: 'cancelled',
          subtotal: 320.75,
          discount: 30.00,
          total: 290.75,
          payment_method_id: 'PM-001',
          payment_method: 'Credit Card',
          payment_status: 'failed',
          promotion_id: 'SPRING10',
          note: 'Customer requested cancellation',
          created_at: '2023-05-12T11:15:00',
          created_by: 'system',
          item_count: 4
        },
        {
          id: 'ORD-004',
          account_id: 'ACC-004',
          account_name: 'Emily Wilson',
          shipping_address_id: 'ADDR-004',
          shipping_address: '321 Maple Dr, Chicago, IL 60601',
          status: 'completed',
          subtotal: 145.99,
          discount: 15.00,
          total: 130.99,
          payment_method_id: 'PM-003',
          payment_method: 'Bank Transfer',
          payment_status: 'completed',
          promotion_id: 'WELCOME15',
          note: null,
          created_at: '2023-05-10T16:45:00',
          created_by: 'system',
          item_count: 1
        },
        {
          id: 'ORD-005',
          account_id: 'ACC-005',
          account_name: 'Michael Brown',
          shipping_address_id: 'ADDR-005',
          shipping_address: '555 Cedar Blvd, Austin, TX 78701',
          status: 'refunded',
          subtotal: 210.25,
          discount: 0,
          total: 210.25,
          payment_method_id: 'PM-001',
          payment_method: 'Credit Card',
          payment_status: 'completed',
          promotion_id: null,
          note: 'Customer requested refund due to damaged item',
          created_at: '2023-05-08T13:20:00',
          created_by: 'system',
          item_count: 2
        },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const showDrawer = (order) => {
    setCurrentOrder(order);
    setSelectedStatus(order.status);
    
    // Fetch order items (mock data)
    const mockOrderItems = [
      {
        id: 1,
        order_id: order.id,
        product_variant_id: 'PV-001',
        product_name: 'Blue Cotton T-Shirt - Size M',
        product_image: 'https://via.placeholder.com/80',
        quantity: 2,
        price: 29.99,
        total: 59.98,
        color: 'Blue',
        size: 'M'
      },
      {
        id: 2,
        order_id: order.id,
        product_variant_id: 'PV-002',
        product_name: 'Black Jeans - Size 32',
        product_image: 'https://via.placeholder.com/80',
        quantity: 1,
        price: 59.99,
        total: 59.99,
        color: 'Black',
        size: '32'
      },
      {
        id: 3,
        order_id: order.id,
        product_variant_id: 'PV-003',
        product_name: 'White Sneakers - Size 10',
        product_image: 'https://via.placeholder.com/80',
        quantity: 1,
        price: 99.99,
        total: 99.99,
        color: 'White',
        size: '10'
      }
    ];
    
    setOrderItems(mockOrderItems);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setCurrentOrder(null);
    setOrderItems([]);
  };

  const showUpdateStatusModal = () => {
    setModalVisible(true);
    form.setFieldsValue({ status: currentOrder.status });
  };

  const handleStatusUpdate = () => {
    form.validateFields()
      .then(values => {
        // Update order status logic would go here
        const updatedOrders = orders.map(order => {
          if (order.id === currentOrder.id) {
            return { ...order, status: values.status };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        setCurrentOrder({ ...currentOrder, status: values.status });
        setSelectedStatus(values.status);
        setModalVisible(false);
        message.success('Order status updated successfully!');
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge status="processing" text="Pending" />;
      case 'completed':
        return <Badge status="success" text="Completed" />;
      case 'cancelled':
        return <Badge status="error" text="Cancelled" />;
      case 'failed':
        return <Badge status="error" text="Failed" />;
      case 'refunded':
        return <Badge status="warning" text="Refunded" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge status="processing" text="Pending" />;
      case 'completed':
        return <Badge status="success" text="Completed" />;
      case 'failed':
        return <Badge status="error" text="Failed" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  const getStatusTag = (status) => {
    let color;
    switch (status) {
      case 'pending':
        color = 'blue';
        break;
      case 'completed':
        color = 'green';
        break;
      case 'cancelled':
        color = 'red';
        break;
      case 'failed':
        color = 'red';
        break;
      case 'refunded':
        color = 'orange';
        break;
      default:
        color = 'default';
    }
    
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const getPaymentStatusTag = (status) => {
    let color;
    switch (status) {
      case 'pending':
        color = 'blue';
        break;
      case 'completed':
        color = 'green';
        break;
      case 'failed':
        color = 'red';
        break;
      default:
        color = 'default';
    }
    
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.id.toLowerCase().includes(value.toLowerCase()) ||
        record.account_name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Customer',
      dataIndex: 'account_name',
      key: 'account_name',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('MM/DD/YYYY HH:mm'),
      sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
    },
    {
      title: 'Items',
      dataIndex: 'item_count',
      key: 'item_count',
      render: (count) => <Tag color="cyan">{count}</Tag>,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Completed', value: 'completed' },
        { text: 'Cancelled', value: 'cancelled' },
        { text: 'Failed', value: 'failed' },
        { text: 'Refunded', value: 'refunded' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Payment',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => getPaymentStatusTag(status),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Completed', value: 'completed' },
        { text: 'Failed', value: 'failed' },
      ],
      onFilter: (value, record) => record.payment_status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => showDrawer(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const orderItemColumns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text, record) => (
        <div className="flex items-center">
          <img 
            src={record.product_image} 
            alt={text} 
            className="w-12 h-12 object-cover mr-3 rounded"
          />
          <div>
            <div>{text}</div>
            <div className="text-gray-500 text-xs">
              Color: {record.color}, Size: {record.size}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Orders</Title>
        <Space>
          <Input 
            placeholder="Search by order ID or customer" 
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="id"
        loading={loading}
      />

      <Drawer
        title={`Order Details - ${currentOrder?.id}`}
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={720}
        extra={
          <Space>
            <Button type="primary" onClick={showUpdateStatusModal}>
              Update Status
            </Button>
          </Space>
        }
      >
        {currentOrder && (
          <>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Order Status"
                    value={currentOrder.status}
                    valueStyle={{ 
                      color: 
                        currentOrder.status === 'completed' ? '#3f8600' : 
                        currentOrder.status === 'cancelled' || currentOrder.status === 'failed' ? '#cf1322' : 
                        currentOrder.status === 'refunded' ? '#fa8c16' : 
                        '#1890ff'
                    }}
                    prefix={
                      currentOrder.status === 'completed' ? <CheckCircleOutlined /> : 
                      currentOrder.status === 'cancelled' || currentOrder.status === 'failed' ? <CloseCircleOutlined /> : 
                      <ClockCircleOutlined />
                    }
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Amount"
                    value={currentOrder.total}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<DollarOutlined />}
                    suffix="$"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Payment Status"
                    value={currentOrder.payment_status}
                    valueStyle={{ 
                      color: 
                        currentOrder.payment_status === 'completed' ? '#3f8600' : 
                        currentOrder.payment_status === 'failed' ? '#cf1322' : 
                        '#1890ff'
                    }}
                    prefix={<CreditCardOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Customer Information</Divider>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Customer Name">
                <UserOutlined className="mr-2" /> {currentOrder.account_name}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address">
                <EnvironmentOutlined className="mr-2" /> {currentOrder.shipping_address}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Order Information</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Order Date">
                {moment(currentOrder.created_at).format('MMMM D, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {currentOrder.payment_method}
              </Descriptions.Item>
              <Descriptions.Item label="Subtotal">
                ${currentOrder.subtotal.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                ${currentOrder.discount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Total" span={2}>
                <Text strong>${currentOrder.total.toFixed(2)}</Text>
              </Descriptions.Item>
              {currentOrder.promotion_id && (
                <Descriptions.Item label="Promotion Code">
                  {currentOrder.promotion_id}
                </Descriptions.Item>
              )}
              {currentOrder.note && (
                <Descriptions.Item label="Note" span={2}>
                  {currentOrder.note}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">Order Items</Divider>
            <Table 
              columns={orderItemColumns} 
              dataSource={orderItems} 
              rowKey="id"
              pagination={false}
            />
          </>
        )}
      </Drawer>

      <Modal
        title="Update Order Status"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleStatusUpdate}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="Order Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select new status">
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;