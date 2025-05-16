'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Layout, Row, Col, Typography, Divider, Card, Grid } from 'antd'
import { motion } from 'framer-motion'
import PoiSearch from '../components/PoiSearch'
import AddPoi from '../components/AddPoi'
import { useAuth } from '../context/AuthContext'
import { savePoi } from '../lib/poiUtils'
import HeaderBar from '../components/HeaderBar'


const { Header, Content } = Layout
const { useBreakpoint } = Grid
const PoiMap = dynamic(() => import('../components/PoiMap'), { ssr: false })

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Page() {
  const { session } = useAuth()
  const screens = useBreakpoint()

  const [mapPois, setMapPois] = useState([])
  const [selectedPOIs, setSelectedPOIs] = useState([])

  const handleSelectPoi = (poi) => {
    const exists = selectedPOIs.find(p => p.id === poi.id)
    const updated = exists
      ? selectedPOIs.filter(p => p.id !== poi.id)
      : [...selectedPOIs, poi].slice(-2)

    setSelectedPOIs(updated)
    setMapPois(updated)
  }

  const handleAddPoi = async (poi, userId) => {
    if (!session) {
      alert('Please log in first')
      return
    }
    try {
      await savePoi(poi, userId)
      alert('POI saved successfully!')

      setMapPois([poi])
      setSelectedPOIs([poi])
    } catch (err) {
      alert('Failed to save POI: ' + err.message)
    }
  }

  // Responsive card heights: taller on desktop, adaptive on mobile
  const mapCardHeight = screens.md ? 520 : 350
  const searchCardMinHeight = screens.md ? 500 : 'auto'

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* <Header
        style={{
          background: 'linear-gradient(90deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
          padding: '24px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
             
        <div style={{ maxWidth: 1200, width: '100%' }}>
          <Typography.Title
            level={2}
            style={{
              color: 'white',
              fontWeight: 'bold',
              margin: 0,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
              userSelect: 'none',
              textAlign: 'center',
            }}
          >
            🌍 POI Explorer
          </Typography.Title>
        </div>
      </Header> */}

<HeaderBar />

      <Content style={{ padding: screens.md ? '24px 48px' : '16px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    minHeight: searchCardMinHeight,
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <Typography.Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>
                    Search Places
                  </Typography.Title>
                  <PoiSearch onSelect={handleSelectPoi} />
                </Card>
              </motion.div>
            </Col>

            <Col xs={24} md={16}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.8 }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    height: mapCardHeight,
                    padding: 0,
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  <Typography.Title
                    level={4}
                    style={{
                      padding: '16px 24px',
                      margin: 0,
                      borderBottom: '1px solid #f0f0f0',
                      userSelect: 'none',
                      textAlign: 'center',
                    }}
                  >
                    Map View
                  </Typography.Title>

                  <PoiMap pois={mapPois} selectedPois={selectedPOIs} onAddPoi={handleAddPoi} />
                </Card>
              </motion.div>
            </Col>
          </Row>

          {session && (
            <>
              <Divider style={{ margin: '48px 0 24px' }} />
              <Row justify="center">
                <Col xs={24} md={12}>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 1 }}
                  >
                    <Card
                      hoverable
                      style={{
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white',
                        padding: screens.md ? '24px' : '16px',
                      }}
                    >
                      <Typography.Title
                        level={4}
                        style={{ marginBottom: 24, textAlign: 'center' }}
                      >
                        Add a New POI
                      </Typography.Title>

                      <AddPoi
                        userId={session.user.id}
                        onAddPoi={handleAddPoi}
                        onSelectPoi={handleSelectPoi}
                      />
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Content>
    </Layout>
  )
}
