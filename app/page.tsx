"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  CreditCard,
  Upload,
  Search,
  Filter,
  MessageSquare,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  Paperclip,
  Send,
  Building,
  User,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Datos de ejemplo
const invoices = [
  {
    id: "INV-2024-001",
    date: "2024-12-15",
    amount: 1250.0,
    ufValue: 3,
    status: "unpaid",
    dueDate: "2024-12-30",
    product: "Enterfact",
    description: "Licencia mensual Enterfact Pro",
  },
  {
    id: "INV-2024-002",
    date: "2024-11-15",
    amount: 850.0,
    ufValue: 2,
    status: "paid",
    dueDate: "2024-11-30",
    product: "AndesPOS",
    description: "Licencia mensual AndesPOS",
  },
  {
    id: "INV-2024-003",
    date: "2024-10-15",
    amount: 2100.0,
    ufValue: 1.5,
    status: "overdue",
    dueDate: "2024-10-30",
    product: "Prowi",
    description: "Licencia anual Prowi Enterprise",
  },
  {
    id: "INV-2024-004",
    date: "2024-09-15",
    amount: 650.0,
    ufValue: 2.5,
    status: "paid",
    dueDate: "2024-09-30",
    product: "Cobrú",
    description: "Licencia mensual Cobrú",
  },
]

const tickets = [
  {
    id: "TKT-2024-001",
    title: "Error en sincronización de inventario",
    status: "open",
    priority: "high",
    product: "AndesPOS",
    created: "2024-12-20",
    lastUpdate: "2024-12-21",
    description: "El inventario no se sincroniza correctamente entre sucursales",
  },
  {
    id: "TKT-2024-002",
    title: "Consulta sobre facturación electrónica",
    status: "resolved",
    priority: "medium",
    product: "Enterfact",
    created: "2024-12-18",
    lastUpdate: "2024-12-19",
    description: "Necesito información sobre configuración de facturación electrónica",
  },
  {
    id: "TKT-2024-003",
    title: "Problema con reportes de ventas",
    status: "in_progress",
    priority: "medium",
    product: "Prowi",
    created: "2024-12-17",
    lastUpdate: "2024-12-20",
    description: "Los reportes de ventas no muestran datos actualizados",
  },
]

const UF_VALUE = 35420 // Valor UF de ejemplo en pesos chilenos

const formatUF = (ufAmount: number) => {
  return `${ufAmount} UF (${(ufAmount * UF_VALUE).toLocaleString()} CLP)`
}

export default function EnternetPortal() {
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [invoiceFilter, setInvoiceFilter] = useState("all")
  const [ticketFilter, setTicketFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [newTicketOpen, setNewTicketOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pagada</Badge>
      case "unpaid":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Vencida</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Abierto</Badge>
      case "in_progress":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">En Progreso</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resuelto</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Media</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Baja</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesFilter = invoiceFilter === "all" || invoice.status === invoiceFilter
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = ticketFilter === "all" || ticket.status === ticketFilter
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const unpaidInvoices = invoices.filter((inv) => inv.status === "unpaid" || inv.status === "overdue")
  const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.ufValue * UF_VALUE, 0)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Portal Enternet</h1>
                  <p className="text-sm text-gray-500">Sistema de Gestión Centralizada</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium">Cliente Demo</span>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{unpaidInvoices.length}</div>
                <p className="text-xs text-muted-foreground">Total: ${totalUnpaid.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tickets Abiertos</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.filter((t) => t.status === "open").length}</div>
                <p className="text-xs text-muted-foreground">
                  En progreso: {tickets.filter((t) => t.status === "in_progress").length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
                <Building className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Enterfact, AndesPOS, Prowi, Cobrú</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado General</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Activo</div>
                <p className="text-xs text-muted-foreground">Todos los servicios operativos</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="invoices" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invoices" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Facturación</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Soporte</span>
              </TabsTrigger>
            </TabsList>

            {/* Facturación Tab */}
            <TabsContent value="invoices" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Gestión de Facturas</CardTitle>
                      <CardDescription>
                        Visualiza y gestiona todas tus facturas de los productos Enternet
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Todo
                      </Button>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros Avanzados
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filtros y Búsqueda */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar facturas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={invoiceFilter} onValueChange={setInvoiceFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="paid">Pagadas</SelectItem>
                        <SelectItem value="unpaid">Pendientes</SelectItem>
                        <SelectItem value="overdue">Vencidas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tabla de Facturas */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Factura</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Vencimiento</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className={invoice.status === "overdue" ? "bg-red-50" : ""}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{invoice.product}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{invoice.description}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>${(invoice.ufValue * UF_VALUE).toLocaleString()}</span>
                                <span className="text-xs text-gray-500">{invoice.ufValue} UF</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Detalle de Factura - {invoice.id}</DialogTitle>
                                      <DialogDescription>Información completa de la factura</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Fecha de Emisión</Label>
                                          <p className="text-sm font-medium">{invoice.date}</p>
                                        </div>
                                        <div>
                                          <Label>Fecha de Vencimiento</Label>
                                          <p className="text-sm font-medium">{invoice.dueDate}</p>
                                        </div>
                                        <div>
                                          <Label>Producto</Label>
                                          <p className="text-sm font-medium">{invoice.product}</p>
                                        </div>
                                        <div>
                                          <Label>Estado</Label>
                                          <div className="mt-1">{getStatusBadge(invoice.status)}</div>
                                        </div>
                                      </div>
                                      <Separator />
                                      <div>
                                        <Label>Descripción</Label>
                                        <p className="text-sm">{invoice.description}</p>
                                      </div>
                                      <div>
                                        <Label>Monto Total</Label>
                                        <p className="text-2xl font-bold">
                                          ${(invoice.ufValue * UF_VALUE).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">{invoice.ufValue} UF</p>
                                      </div>

                                      {invoice.status !== "paid" && (
                                        <>
                                          <Separator />
                                          <div className="space-y-4">
                                            <h4 className="font-medium">Datos para Transferencia</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                              <div className="flex justify-between">
                                                <span>Banco:</span>
                                                <span className="font-medium">Banco Nacional</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>Cuenta:</span>
                                                <span className="font-medium">123-456789-0</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>CBU:</span>
                                                <span className="font-medium">1234567890123456789012</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>Titular:</span>
                                                <span className="font-medium">Enternet S.A.</span>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      <div className="flex flex-wrap gap-2 pt-4">
                                        <Button>
                                          <FileText className="h-4 w-4 mr-2" />
                                          Ver PDF
                                        </Button>
                                        <Button variant="outline">
                                          <Download className="h-4 w-4 mr-2" />
                                          Descargar XML
                                        </Button>
                                        {invoice.status !== "paid" && (
                                          <>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button className="bg-green-600 hover:bg-green-700">
                                                  <CreditCard className="h-4 w-4 mr-2" />
                                                  Pagar Ahora
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Pagar factura con tarjeta de crédito</p>
                                              </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button variant="outline">
                                                  <Upload className="h-4 w-4 mr-2" />
                                                  Subir Comprobante
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Adjuntar comprobante de pago para validar el pago de la factura</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Soporte Tab */}
            <TabsContent value="support" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Centro de Soporte</CardTitle>
                      <CardDescription>Gestiona tus tickets de soporte y obtén ayuda técnica</CardDescription>
                    </div>
                    <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Ticket
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Crear Nuevo Ticket de Soporte</DialogTitle>
                          <DialogDescription>
                            Describe tu problema o consulta para recibir ayuda de nuestro equipo
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="product">Producto</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un producto" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="enterfact">Enterfact</SelectItem>
                                  <SelectItem value="andespos">AndesPOS</SelectItem>
                                  <SelectItem value="prowi">Prowi</SelectItem>
                                  <SelectItem value="cobru">Cobrú</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="priority">Prioridad</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Baja</SelectItem>
                                  <SelectItem value="medium">Media</SelectItem>
                                  <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="title">Título del Ticket</Label>
                            <Input placeholder="Describe brevemente el problema" />
                          </div>
                          <div>
                            <Label htmlFor="description">Descripción Detallada</Label>
                            <Textarea
                              placeholder="Proporciona todos los detalles posibles sobre el problema..."
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label>Archivos Adjuntos</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">
                                Arrastra archivos aquí o haz clic para seleccionar
                              </p>
                              <p className="text-xs text-gray-400 mt-1">Máximo 10MB por archivo</p>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setNewTicketOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={() => setNewTicketOpen(false)}>Crear Ticket</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filtros y Búsqueda */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar tickets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={ticketFilter} onValueChange={setTicketFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="open">Abiertos</SelectItem>
                        <SelectItem value="in_progress">En Progreso</SelectItem>
                        <SelectItem value="resolved">Resueltos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de Tickets */}
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-lg">{ticket.title}</h3>
                                {getTicketStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                              </div>
                              <p className="text-gray-600 mb-2">{ticket.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>#{ticket.id}</span>
                                <span>•</span>
                                <span>{ticket.product}</span>
                                <span>•</span>
                                <span>Creado: {ticket.created}</span>
                                <span>•</span>
                                <span>Actualizado: {ticket.lastUpdate}</span>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center space-x-2">
                                    <span>Ticket #{ticket.id}</span>
                                    {getTicketStatusBadge(ticket.status)}
                                    {getPriorityBadge(ticket.priority)}
                                  </DialogTitle>
                                  <DialogDescription>{ticket.title}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Producto</Label>
                                      <p className="font-medium">{ticket.product}</p>
                                    </div>
                                    <div>
                                      <Label>Fecha de Creación</Label>
                                      <p className="font-medium">{ticket.created}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Descripción Original</Label>
                                    <p className="text-sm bg-gray-50 p-3 rounded">{ticket.description}</p>
                                  </div>

                                  <Separator />

                                  <div>
                                    <h4 className="font-medium mb-4">Historial de Conversación</h4>
                                    <div className="space-y-4">
                                      <div className="flex space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                          <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                              <span className="font-medium text-sm">Cliente</span>
                                              <span className="text-xs text-gray-500">{ticket.created}</span>
                                            </div>
                                            <p className="text-sm">{ticket.description}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                          <MessageSquare className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                              <span className="font-medium text-sm">Soporte Técnico</span>
                                              <span className="text-xs text-gray-500">{ticket.lastUpdate}</span>
                                            </div>
                                            <p className="text-sm">
                                              Hemos recibido tu consulta y estamos trabajando en una solución. Te
                                              contactaremos en las próximas 24 horas con más información.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div>
                                    <Label>Agregar Comentario</Label>
                                    <Textarea
                                      placeholder="Escribe tu respuesta o proporciona información adicional..."
                                      rows={3}
                                      className="mt-2"
                                    />
                                    <div className="flex justify-between items-center mt-4">
                                      <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm">
                                          <Paperclip className="h-4 w-4 mr-2" />
                                          Adjuntar Archivo
                                        </Button>
                                      </div>
                                      <Button>
                                        <Send className="h-4 w-4 mr-2" />
                                        Enviar Respuesta
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}
