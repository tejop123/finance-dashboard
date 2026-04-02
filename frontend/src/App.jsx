import { useEffect, useMemo, useState } from 'react'
import './App.css'

const baseTransactions = [
  {
    id: 'tx-1001',
    date: '2026-03-28',
    description: 'Salary - March',
    category: 'Salary',
    type: 'income',
    amount: 5200,
  },
  {
    id: 'tx-1002',
    date: '2026-03-25',
    description: 'Rent payment',
    category: 'Housing',
    type: 'expense',
    amount: 1600,
  },
  {
    id: 'tx-1003',
    date: '2026-03-21',
    description: 'Groceries',
    category: 'Food',
    type: 'expense',
    amount: 186.42,
  },
  {
    id: 'tx-1004',
    date: '2026-03-20',
    description: 'Gym membership',
    category: 'Wellness',
    type: 'expense',
    amount: 65,
  },
  {
    id: 'tx-1005',
    date: '2026-03-18',
    description: 'Freelance project',
    category: 'Freelance',
    type: 'income',
    amount: 980,
  },
  {
    id: 'tx-1006',
    date: '2026-03-15',
    description: 'Electricity bill',
    category: 'Utilities',
    type: 'expense',
    amount: 120.33,
  },
  {
    id: 'tx-1007',
    date: '2026-03-12',
    description: 'Dining out',
    category: 'Food',
    type: 'expense',
    amount: 74.8,
  },
  {
    id: 'tx-1008',
    date: '2026-03-09',
    description: 'Transportation',
    category: 'Transport',
    type: 'expense',
    amount: 52.15,
  },
  {
    id: 'tx-1009',
    date: '2026-03-04',
    description: 'Side gig payout',
    category: 'Freelance',
    type: 'income',
    amount: 420,
  },
  {
    id: 'tx-1010',
    date: '2026-02-28',
    description: 'Salary - February',
    category: 'Salary',
    type: 'income',
    amount: 5100,
  },
  {
    id: 'tx-1011',
    date: '2026-02-23',
    description: 'Insurance premium',
    category: 'Insurance',
    type: 'expense',
    amount: 210,
  },
  {
    id: 'tx-1012',
    date: '2026-02-18',
    description: 'Groceries',
    category: 'Food',
    type: 'expense',
    amount: 162.9,
  },
  {
    id: 'tx-1013',
    date: '2026-02-16',
    description: 'Internet',
    category: 'Utilities',
    type: 'expense',
    amount: 58.4,
  },
  {
    id: 'tx-1014',
    date: '2026-02-12',
    description: 'Coffee & snacks',
    category: 'Food',
    type: 'expense',
    amount: 32.15,
  },
  {
    id: 'tx-1015',
    date: '2026-02-08',
    description: 'Transport pass',
    category: 'Transport',
    type: 'expense',
    amount: 48.6,
  },
]

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const formatCurrency = (value) => currencyFormatter.format(value)

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const monthKey = (value) => {
  const date = new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const monthLabel = (value) => {
  const date = new Date(`${value}-01T00:00:00`)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function App() {
  const [role, setRole] = useState('viewer')
  const [theme, setTheme] = useState('light')
  const lastUpdatedLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  )
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('financeDashboard.transactions')
    return stored ? JSON.parse(stored) : baseTransactions
  })
  const [filters, setFilters] = useState({ type: 'all', category: 'all' })
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'desc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formState, setFormState] = useState({
    date: '',
    description: '',
    category: 'Food',
    type: 'expense',
    amount: '',
  })
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(
      'financeDashboard.transactions',
      JSON.stringify(transactions),
    )
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('financeDashboard.theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const storedTheme = localStorage.getItem('financeDashboard.theme')
    if (storedTheme) {
      setTheme(storedTheme)
      document.documentElement.setAttribute('data-theme', storedTheme)
    }
  }, [])


  useEffect(() => {
    if (!actionMessage) return
    const timer = setTimeout(() => setActionMessage(''), 2800)
    return () => clearTimeout(timer)
  }, [actionMessage])

  const categories = useMemo(() => {
    const set = new Set(transactions.map((tx) => tx.category))
    return Array.from(set).sort()
  }, [transactions])

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.income += tx.amount
        } else {
          acc.expenses += tx.amount
        }
        acc.balance = acc.income - acc.expenses
        return acc
      },
      { income: 0, expenses: 0, balance: 0 },
    )
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return transactions
      .filter((tx) => (filters.type === 'all' ? true : tx.type === filters.type))
      .filter((tx) =>
        filters.category === 'all' ? true : tx.category === filters.category,
      )
      .filter((tx) =>
        term
          ? `${tx.description} ${tx.category}`.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => {
        const direction = sortConfig.direction === 'asc' ? 1 : -1
        if (sortConfig.field === 'amount') {
          return (a.amount - b.amount) * direction
        }
        if (sortConfig.field === 'category') {
          return a.category.localeCompare(b.category) * direction
        }
        return (new Date(a.date) - new Date(b.date)) * direction
      })
  }, [transactions, filters, searchTerm, sortConfig])

  const spendingByCategory = useMemo(() => {
    const buckets = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount
        return acc
      }, {})

    const entries = Object.entries(buckets)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)

    const total = entries.reduce((sum, item) => sum + item.amount, 0)

    return { entries, total }
  }, [transactions])

  const monthlyTrend = useMemo(() => {
    const buckets = transactions.reduce((acc, tx) => {
      const key = monthKey(tx.date)
      if (!acc[key]) {
        acc[key] = { income: 0, expenses: 0 }
      }
      if (tx.type === 'income') {
        acc[key].income += tx.amount
      } else {
        acc[key].expenses += tx.amount
      }
      return acc
    }, {})

    const months = Object.keys(buckets).sort()
    const timeline = months.map((key) => {
      const { income, expenses } = buckets[key]
      return {
        key,
        label: monthLabel(key),
        balance: income - expenses,
        income,
        expenses,
      }
    })

    let running = 0
    const cumulative = timeline.map((item) => {
      running += item.balance
      return { ...item, cumulative: running }
    })

    return cumulative
  }, [transactions])

  const highestCategory = useMemo(() => {
    if (!spendingByCategory.entries.length) return 'N/A'
    return spendingByCategory.entries[0].category
  }, [spendingByCategory])

  const monthlyInsight = useMemo(() => {
    if (monthlyTrend.length < 2) return null
    const current = monthlyTrend[monthlyTrend.length - 1]
    const previous = monthlyTrend[monthlyTrend.length - 2]
    const diff = current.expenses - previous.expenses
    const direction = diff <= 0 ? 'decrease' : 'increase'
    return {
      diff: Math.abs(diff),
      direction,
      month: current.label,
    }
  }, [monthlyTrend])

  const savingsRate = useMemo(() => {
    if (!totals.income) return 0
    return ((totals.income - totals.expenses) / totals.income) * 100
  }, [totals])

  const activeFilters = useMemo(() => {
    const labels = []
    if (filters.type !== 'all') labels.push(`Type: ${filters.type}`)
    if (filters.category !== 'all') labels.push(`Category: ${filters.category}`)
    if (searchTerm.trim()) labels.push(`Search: ${searchTerm.trim()}`)
    return labels
  }, [filters, searchTerm])

  const clearFilters = () => {
    setFilters({ type: 'all', category: 'all' })
    setSearchTerm('')
    setSortConfig({ field: 'date', direction: 'desc' })
  }

  const openForm = (transaction) => {
    if (transaction) {
      setEditingId(transaction.id)
      setFormState({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        amount: String(transaction.amount),
      })
    } else {
      setEditingId(null)
      setFormState({
        date: '',
        description: '',
        category: categories[0] || 'Food',
        type: 'expense',
        amount: '',
      })
    }
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const amount = Number.parseFloat(formState.amount)
    if (!formState.date || !formState.description || !formState.category || !amount) {
      return
    }

    const payload = {
      id: editingId || `tx-${Date.now()}`,
      date: formState.date,
      description: formState.description,
      category: formState.category,
      type: formState.type,
      amount,
    }

    setTransactions((prev) => {
      if (editingId) {
        return prev.map((tx) => (tx.id === editingId ? payload : tx))
      }
      return [payload, ...prev]
    })

    closeForm()
  }

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const handleExportCsv = () => {
    const header = ['Date', 'Description', 'Category', 'Type', 'Amount']
    const rows = transactions.map((tx) => [
      tx.date,
      tx.description.replaceAll(',', ' '),
      tx.category,
      tx.type,
      tx.amount,
    ])
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
    downloadFile(csv, 'transactions.csv', 'text/csv')
    setActionMessage('CSV exported to downloads.')
  }

  const handleMonthlyReport = () => {
    const lines = monthlyTrend.map(
      (item) =>
        `${item.label}: Income ${formatCurrency(item.income)}, Expenses ${formatCurrency(
          item.expenses,
        )}, Balance ${formatCurrency(item.balance)}`,
    )
    const report = `Monthly Summary\n\n${lines.join('\n')}`
    downloadFile(report, 'monthly-report.txt', 'text/plain')
    setActionMessage('Monthly report downloaded.')
  }

  const handleBudgetReview = () => {
    if (!spendingByCategory.entries.length) {
      setActionMessage('Add expenses to review your budget.')
      return
    }
    setActionMessage(`Focus on ${highestCategory} to lower spending this month.`)
  }

  const trendPoints = useMemo(() => {
    if (!monthlyTrend.length) return ''
    const max = Math.max(...monthlyTrend.map((item) => item.cumulative))
    const min = Math.min(...monthlyTrend.map((item) => item.cumulative))
    const range = max - min || 1
    return monthlyTrend
      .map((item, index) => {
        const x = (index / (monthlyTrend.length - 1 || 1)) * 100
        const y = 100 - ((item.cumulative - min) / range) * 80 - 10
        return `${x},${y}`
      })
      .join(' ')
  }, [monthlyTrend])

  return (
    <div className="app">
      <header className="topbar topbar-surface">
        <div>
          <p className="eyebrow">Finance Dashboard</p>
          <h1>
            Welcome back, <span className="welcome-name">Tejasv</span>
          </h1>
          <p className="subtitle">
            Overview of balances, activity, and spending categories.
          </p>
          <p className="meta">Last updated {lastUpdatedLabel}</p>
        </div>
        <div className="topbar-actions">
          <div className="select-group">
            <div className="role-row">
              <label htmlFor="role">Role</label>
              <span className={`role-badge ${role}`}>{role}</span>
            </div>
            <select
              id="role"
              className="role-select"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            className="ghost"
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          {role === 'admin' && (
            <button className="primary" type="button" onClick={() => openForm()}>
              Add transaction
            </button>
          )}
        </div>
      </header>

      <section className="grid overview">
        <div className="card summary">
          <p>Total balance</p>
          <h2>{formatCurrency(totals.balance)}</h2>
          <span className="badge positive">+{savingsRate.toFixed(1)}% savings</span>
        </div>
        <div className="card summary">
          <p>Total income</p>
          <h2>{formatCurrency(totals.income)}</h2>
          <span className="badge">Last 60 days</span>
        </div>
        <div className="card summary">
          <p>Total expenses</p>
          <h2>{formatCurrency(totals.expenses)}</h2>
          <span className="badge warning">Budget watch</span>
        </div>
        <div className="card trend">
          <div className="card-header">
            <div>
              <h3>Balance trend</h3>
              <p>Net balance over time</p>
            </div>
            <span className="pill">{monthlyTrend.length} months</span>
          </div>
          <div className="chart">
            {monthlyTrend.length ? (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={trendPoints}
                  fill="none"
                  stroke="url(#trendGradient)"
                  strokeWidth="2.8"
                />
                <defs>
                  <linearGradient id="trendGradient" x1="0" x2="1">
                    <stop offset="0%" stopColor="#7c5cff" />
                    <stop offset="100%" stopColor="#2ed3b7" />
                  </linearGradient>
                </defs>
              </svg>
            ) : (
              <p className="empty">No trend data yet.</p>
            )}
            <div className="chart-labels">
              {monthlyTrend.map((item) => (
                <span key={item.key}>{item.label}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="card breakdown">
          <div className="card-header">
            <div>
              <h3>Spending breakdown</h3>
              <p>Top categories</p>
            </div>
            <span className="pill">{formatCurrency(spendingByCategory.total)}</span>
          </div>
          <div className="breakdown-list">
            {spendingByCategory.entries.length ? (
              spendingByCategory.entries.map((item) => (
                <div className="breakdown-item" key={item.category}>
                  <div>
                    <strong>{item.category}</strong>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="progress">
                    <span
                      style={{
                        width: `${
                          (item.amount / spendingByCategory.total) * 100 || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="empty">No expenses recorded.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid transactions">
        <div className="card full">
          <div className="card-header">
            <div>
              <h3>Transactions</h3>
              <p>Search, filter, and sort activity</p>
            </div>
            <div className="filters">
              <input
                type="search"
                placeholder="Search category or description"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <select
                value={filters.type}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, type: event.target.value }))
                }
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                value={filters.category}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={`${sortConfig.field}-${sortConfig.direction}`}
                onChange={(event) => {
                  const [field, direction] = event.target.value.split('-')
                  setSortConfig({ field, direction })
                }}
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Amount high to low</option>
                <option value="amount-asc">Amount low to high</option>
                <option value="category-asc">Category A-Z</option>
                <option value="category-desc">Category Z-A</option>
              </select>
            </div>
            {activeFilters.length > 0 && (
              <div className="filter-row">
                <div className="filter-chips">
                  {activeFilters.map((label) => (
                    <span className="chip" key={label}>
                      {label}
                    </span>
                  ))}
                </div>
                <button className="ghost" type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {filteredTransactions.length ? (
            <div className="table">
              <div className={`table-row header ${role === 'admin' ? 'has-actions' : ''}`}>
                <span>Date</span>
                <span>Category</span>
                <span>Details</span>
                <span>Type</span>
                <span className="amount">Amount</span>
                {role === 'admin' && <span className="actions">Actions</span>}
              </div>
              {filteredTransactions.map((tx) => (
                <div
                  className={`table-row ${role === 'admin' ? 'has-actions' : ''}`}
                  key={tx.id}
                >
                  <span data-label="Date">{formatDate(tx.date)}</span>
                  <span data-label="Category">{tx.category}</span>
                  <span data-label="Details">{tx.description}</span>
                  <span data-label="Type" className={`type ${tx.type}`}>
                    {tx.type}
                  </span>
                  <span data-label="Amount" className="amount">
                    {tx.type === 'expense' ? '-' : '+'}
                    {formatCurrency(tx.amount)}
                  </span>
                  {role === 'admin' && (
                    <span data-label="Actions" className="actions">
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => openForm(tx)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ghost danger"
                        onClick={() => handleDelete(tx.id)}
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h4>No transactions found</h4>
              <p>Try adjusting your filters or add a new transaction.</p>
              {role === 'admin' && (
                <button className="primary" type="button" onClick={() => openForm()}>
                  Add transaction
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="grid insights">
        <div className="card insight">
          <h3>Insights</h3>
          <ul>
            <li>
              Highest spending category: <strong>{highestCategory}</strong>
            </li>
            <li>
              Savings rate: <strong>{savingsRate.toFixed(1)}%</strong>
            </li>
            <li>
              {monthlyInsight ? (
                <>
                  {monthlyInsight.month}: spending {monthlyInsight.direction} of{' '}
                  <strong>{formatCurrency(monthlyInsight.diff)}</strong>
                </>
              ) : (
                'Add more months to unlock monthly insights.'
              )}
            </li>
          </ul>
        </div>
        <div className="card insight">
          <h3>Quick actions</h3>
          <p>Export data or generate a lightweight summary.</p>
          <div className="action-grid">
            <button type="button" className="ghost" onClick={handleExportCsv}>
              Export CSV
            </button>
            <button type="button" className="ghost" onClick={handleMonthlyReport}>
              Monthly report
            </button>
            <button type="button" className="ghost" onClick={handleBudgetReview}>
              Budget review
            </button>
          </div>
          {actionMessage && <p className="action-message">{actionMessage}</p>}
        </div>
      </section>

      {isFormOpen && role === 'admin' && (
        <div className="modal">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3>{editingId ? 'Edit transaction' : 'Add transaction'}</h3>
                <p>Update the latest activity in your ledger.</p>
              </div>
              <button className="ghost" type="button" onClick={closeForm}>
                Close
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={formState.date}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Description
                <input
                  type="text"
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                  placeholder="e.g. Grocery run"
                  required
                />
              </label>
              <label>
                Category
                <input
                  type="text"
                  name="category"
                  value={formState.category}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Type
                <select name="type" value={formState.type} onChange={handleFormChange}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>
              <label>
                Amount
                <input
                  type="number"
                  name="amount"
                  value={formState.amount}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  required
                />
              </label>
              <div className="modal-actions">
                <button className="ghost" type="button" onClick={closeForm}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  {editingId ? 'Save changes' : 'Add transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
