
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const chartConfig = {
  visits: {
    label: 'Visits',
    color: '#5ce500',
  },
};

const Statistics = () => {
  const { secretUrl } = useParams();
  const navigate = useNavigate();

  console.log(secretUrl);

  // Fetch statistics from the API
  const { data, isLoading, error } = useQuery({
    queryKey: ['stats', secretUrl],
    queryFn: async () => {
      const response = await fetch(`https://n8n.presiyangeorgiev.eu/webhook/7a8a7b20-adfb-4c31-acaa-bbafb19a6215/shortie/stats/${secretUrl}`);
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      return response.json();
    },
    enabled: !!secretUrl, // Only fetch if secretUrl exists
  });

  const handleBackToHome = () => {
    navigate('/');
  };

  // Transform API data for charts
  const visitsData = data?.dailyVisits?.map((item: any) => ({
    date: item.date,
    visits: parseInt(item.count, 10),
  })) || [];

  const ipData = data?.topIps?.map((item: any) => ({
    ip: item.ip,
    visits: parseInt(item.count, 10),
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent border-t-transparent mx-auto mb-4"></div>
            <div className="text-foreground">Loading statistics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-destructive mb-4">Failed to load statistics</div>
            <Button onClick={handleBackToHome} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
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
              {visitsData.length > 0 ? (
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
                        stroke="#5ce500"
                        strokeWidth={3}
                        dot={{ fill: '#5ce500', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#5ce500', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No visit data available
                </div>
              )}
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
              {ipData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">IP Address</TableHead>
                      <TableHead className="text-muted-foreground text-right">Number of Visits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ipData.slice(0, 10).map((item, index) => (
                      <TableRow key={item.ip} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-foreground">{item.ip}</TableCell>
                        <TableCell className="text-right text-foreground font-semibold">
                          {item.visits}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No IP data available
                </div>
              )}
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
              {ipData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ipData.slice(0, 5)} layout="horizontal">
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
                        fill="#5ce500"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No data available for visualization
                </div>
              )}
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
