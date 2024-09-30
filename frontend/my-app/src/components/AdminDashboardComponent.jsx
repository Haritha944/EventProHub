import React ,{useEffect,useState} from 'react';
import axios from 'axios';
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,LineChart,Line
} from 'recharts';


const BASE_URL = process.env.REACT_APP_BASE_URL;
function AdminDashboardComponent ()  {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredSalesData, setFilteredSalesData] = useState([]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}admin/admindash/`);
        
        setDashboardData(response.data);
        console.log(dashboardData)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setLoading(false);
      }
    };
   
      fetchDashboardData();
    
  }, []);

  if (loading) return <div>Loading...</div>;

  const monthlySalesData = dashboardData.monthly_sales? dashboardData.monthly_sales.map(item => ({
    month: new Date(item.month).toLocaleString('default', { month: 'short', year: 'numeric' }),
    sales: item.total_sales,
  })):[];

  const dailySalesData = dashboardData.daily_sales ? dashboardData.daily_sales.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    sales: item.total_sales,
  })) : [];


  const yearlySalesData = dashboardData.yearly_sales ? dashboardData.yearly_sales.map(item => ({
    year: item.year,
    sales: item.total_sales,
  })):[];
  const handleOptionChange=(event)=>{
    setSelectedOption(event.target.value);
  }
  const renderChart = ()=>{
    switch(selectedOption){
        case 'daily':
            return (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dailySalesData}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            );
        case 'monthly':
            return (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlySalesData}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
        
            );
        case 'yearly':
            return (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={yearlySalesData}
                  margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            );
        default:
            return null;
    }
  }
  const filterSalesData=()=>{
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const filteredData=dailySalesData.filter((item)=>{
      const itemDate = new Date(item.date);
      const start=new Date(startDate);
      const end = new Date(endDate);
      return itemDate >=start && itemDate <=end;
    });
    setFilteredSalesData(filteredData);
    setStartDate('')
    setEndDate('')
    
    
  };
  const filterChart = () => {
    // Use filtered data if available, otherwise use the full daily sales data
    const dataToRender = filteredSalesData.length > 0 ? filteredSalesData : dailySalesData;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dataToRender}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#888dd8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
   <>
   <div>

   <div className="dashboard-stats">
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">Total Users</h2>
              <p className="text-xl text-orange-500 text-bold"> {dashboardData.total_users}</p>
            </div>
            <div className="bg-gray p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">Total Servicers</h2>
              <p className="text-2xl text-orange-500 text-bold"> {dashboardData.total_servicers}</p>
            </div>
            <div className="bg-gray p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">Total Sales</h2>
              <p className="text-xl text-orange-500 text-bold">Rs.{dashboardData.total_sales}</p>
            </div>
            <div className="bg-gray p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-blue-600">Subscribed Servicers</h2>
              <p className="text-xl text-orange-500 text-bold"> {dashboardData.subscribed_servicers.length}</p>
            </div>
        </div>
      </div>
      <div>
     
    </div>
    

      <div className='mt-10 text-right'>
        <label className='text-red-600 font-semibold' htmlFor="sales-type">Select Sales Type: </label>
        <select className="bg-gray-100" id="sales-type" value={selectedOption} onChange={handleOptionChange}>
          <option value="daily">Daily Sales</option>
          <option value="monthly">Monthly Sales</option>
          <option value="yearly">Yearly Sales</option>
        </select>
      </div>
      
      {/* Render the selected chart */}
      <div style={{ marginTop: '20px' }}>
        {renderChart()}
      </div>
      <div className='mt-8'>
        <label className='text-red-600 mx-3'>Start Date: </label>
        <input className='bg-gray-300'
             type="date"
             value={startDate}
             onChange={(e) => setStartDate(e.target.value)}
         />
         <label className='text-red-600 mx-3'>End Date:</label>
      <input className='bg-gray-300'
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
  <button className="bg-violet-700 mx-6 rounded-full py-2 px-3" onClick={filterSalesData}>Filter Data</button>
      </div>
      <div>
        {filterChart()}
      </div>
      </div>
   </>
  )
}

export default AdminDashboardComponent