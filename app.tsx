import { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';

interface MenuItem {
  name: string;
  category: string;
  price: number;
}

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const menuData: MenuItem[] = [
  { name: 'Beer', category: 'Beer', price: 2.00 },
  { name: 'Cola', category: 'Refreshments', price: 1.75 },
];

function App() {
  const [customerName, setCustomerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const categories = useMemo(() => {
    const cats = [...new Set(menuData.map(item => item.category))];
    return cats.sort();
  }, []);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    categories.forEach(cat => {
      grouped[cat] = menuData.filter(item => item.category === cat);
    });
    return grouped;
  }, [categories]);

  const handleAddCustomer = () => {
    if (nameInput.trim()) {
      setCustomerName(nameInput.trim());
      setNameInput('');
    }
  };

  const handleAddItem = () => {
    if (selectedItem && quantity > 0) {
      const newItem: OrderItem = {
        id: `${Date.now()}-${Math.random()}`,
        name: selectedItem.name,
        category: selectedItem.category,
        price: selectedItem.price,
        quantity,
      };
      setOrderItems([...orderItems, newItem]);
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Order Management</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Customer Name
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomer()}
                  placeholder="Enter customer name..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
                <button
                  onClick={handleAddCustomer}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Set
                </button>
              </div>
              {customerName && (
                <p className="mt-2 text-sm text-slate-600">
                  Customer: <span className="font-semibold text-slate-900">{customerName}</span>
                </p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Items</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Item
                  </label>
                  <select
                    value={selectedItem ? `${selectedItem.name}-${selectedItem.category}` : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [name, category] = e.target.value.split('-');
                        const item = menuData.find(
                          m => m.name === name && m.category === category
                        );
                        setSelectedItem(item || null);
                      } else {
                        setSelectedItem(null);
                      }
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">Choose an item...</option>
                    {categories.map(category => (
                      <optgroup key={category} label={category}>
                        {itemsByCategory[category].map(item => (
                          <option
                            key={`${item.name}-${category}`}
                            value={`${item.name}-${category}`}
                          >
                            {item.name} - ${item.price.toFixed(2)}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                <button
                  onClick={handleAddItem}
                  disabled={!selectedItem}
                  className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Add to Order
                </button>
              </div>
            </div>

            {orderItems.length > 0 && (
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-4 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-slate-900 text-white rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-3xl font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
