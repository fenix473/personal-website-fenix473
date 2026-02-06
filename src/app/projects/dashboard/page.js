'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import '@/styles/Projects.css';
import '@/styles/Dashboard.css';
import DashboardLoading from './components/DashboardLoading';
import DashboardHeader from './components/DashboardHeader';
import DashboardTable from './components/DashboardTable';
import DashboardForm from './components/DashboardForm';
import DashboardMap from './components/DashboardMap';
import DashboardStats from './components/DashboardStats';

const paperSx = {
  backgroundColor: 'transparent',
  padding: 0,
  boxShadow: 'none',
};

export default function DashboardPage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [mapPickerMode, setMapPickerMode] = useState(false);
  const locationSelectHandlerRef = useRef(null);

  const handleMapLocationSelect = useCallback((lat, lng) => {
    locationSelectHandlerRef.current?.(lat, lng);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [entriesRes, meRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/auth/me', { credentials: 'include' }),
        ]);
        if (!entriesRes.ok) throw new Error('Failed to fetch dashboard entries');
        const data = await entriesRes.json();
        setDataSource(
          Array.isArray(data) ? data : data.dashboardEntries ?? data.entries ?? []
        );
        setTotalIncidents(data.totalIncidents ?? 0);

        if (meRes.ok) {
          const { user: u } = await meRes.json();
          setUser(u);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Error loading dashboard entries:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="projects dashboard-page">
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Paper sx={paperSx} component="div">
              <DashboardHeader />
            </Paper>
          </Grid>
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{ display: 'flex', flexDirection: 'column', minHeight: '70vh' }}
          >
            <Paper
              sx={{
                ...paperSx,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
              component="div"
            >
              <DashboardMap
                pickerMode={mapPickerMode}
                onLocationSelect={handleMapLocationSelect}
                userEntries={dataSource}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={2} direction="column">
              <Grid size={12}>
                <Paper sx={paperSx} component="div">
                  <DashboardForm
                    onSuccess={(entry) => setDataSource((prev) => [entry, ...prev])}
                    onStepChange={(step) => setMapPickerMode(step === 2)}
                    registerLocationHandler={(handler) => {
                      locationSelectHandlerRef.current = handler;
                    }}
                  />
                </Paper>
              </Grid>
              <Grid size={12}>
                <Paper sx={paperSx} component="div">
                  <DashboardStats totalIncidents={totalIncidents} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={12} className="dashboard-page__table-grid">
            <Paper sx={paperSx} component="div" className="dashboard-page__table-paper">
              <DashboardTable
                dataSource={dataSource}
                setDataSource={setDataSource}
                user={user}
                setUser={setUser}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
