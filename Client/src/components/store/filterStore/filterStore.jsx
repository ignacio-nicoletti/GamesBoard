import React, { useState, useEffect } from 'react';
import style from './filterStore.module.css';

const FilterStore = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    filterStatus: 'all', // 'all', 'redeemed', 'notRedeemed'
  });

  // Actualiza el filtro en tiempo real
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    onFilter(filters); // Llama a la función de filtro en tiempo real cuando el estado cambia
  }, [filters, onFilter]);

  return (
    <div className={style.filterContainer}>
      <input
        type="text"
        name="name"
        placeholder="Filter by name"
        value={filters.name}
        onChange={handleFilterChange}
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleFilterChange}
      >
        <option value="">All Categories</option>
        <option value="Avatar">Avatar</option>
        <option value="XP">XP</option>
        <option value="Coins">Coins</option>
        <option value="Paint">Paints</option>
        {/* Add other categories as needed */}
      </select>
      <select
        name="filterStatus"
        value={filters.filterStatus}
        onChange={handleFilterChange}
      >
        <option value="all">All</option>
        <option value="redeemed">Redeemed</option>
        <option value="notRedeemed">Not Redeemed</option>
      </select>
    </div>
  );
};

export default FilterStore;
