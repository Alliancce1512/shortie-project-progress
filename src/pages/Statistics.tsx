
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft } from 'lucide-react';

// Mock data for demonstration - replace with actual API calls
const mockVisitsData = [
  { date: '2024-06-15', visits: 12 },
  { date: '2024-06-16', visits: 19 },
  { date: '2024-06-17', visits: 8 },
  { date: '2024-06-18', visits: 25 },
  { date: '2024-06-19', visits: 16 },
  { date: '2024-06-20', visits: 32 },
  { date: '2024-06-21', visits: 28 },
];

const mockIPData = [
  { ip: '192.168.1.1', visits: 45 },
  { ip: '10.0.0.1', visits: 32 },
  { ip: '172.16.0.1', visits: 28 },
  { ip: '203.0.113.1', visits: 24 },
  { ip: '198.51.100.1', visits: 19 },
  { ip: '192.0.2.1', visits: 16 },
  { ip: '203.0.113.2', visits: 14 },
  { ip: '198.51.100.2', visits: 12 },
  { ip: '192.0.2.2', visits: 9 },
  { ip: '203.0.113.3', visits: 7 },
];

const chartConfig = {
  visits: {
    label: 'Visits',
    color: '#00C896',
  },
};

const Statistics = () => {
  const { secretUrl } = useParams();
  const navigate = useNavigate();

  // Mock API call - replace with actual endpoint
  const { data: visitsData, isLoading: visitsLoading } = useQuery({
    queryKey: ['visits', secretUrl],
    queryFn: () => Promise.resolve(mockVisitsData),
  });

  const { data: ipData, isLoading: ipLoading } = useQuery({
    queryKey: ['ips', secretUrl],
    queryFn: () => Promise.resolve(mockIPData),
  });

  const handleBackToHome = () => {
    navigate('/');
  };

  if (visitsLoading || ipLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Link Statistics
            </h1>
            <p className="text-muted-foreground">
              Analytics for your shortened URL
            </p>
          </div>

          {/* Daily Visits Chart */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Unique Visits Per Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitsData}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#00C896"
                      strokeWidth={3}
                      dot={{ fill: '#00C896', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#00C896', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top IPs Table */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Top 10 IPs by Visit Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">IP Address</TableHead>
                    <TableHead className="text-muted-foreground text-right">Number of Visits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ipData?.map((item, index) => (
                    <TableRow key={item.ip} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-foreground">{item.ip}</TableCell>
                      <TableCell className="text-right text-foreground font-semibold">
                        {item.visits}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top IPs Bar Chart */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Top IPs Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ipData?.slice(0, 5)} layout="horizontal">
                    <XAxis 
                      type="number"
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category"
                      dataKey="ip"
                      stroke="#6B7280"
                      fontSize={12}
                      width={100}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="visits"
                      fill="#00C896"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
