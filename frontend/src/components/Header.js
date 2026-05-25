import React from 'react';
import './Header.css';

const Header = ({ stats, onAddClick }) => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo">🎬</span>
          <div>
            <h1 className="header-title">Movie Vault</h1>
            <p className="header-subtitle">Tu colección personal</p>
          </div>
        </div>

        <div className="header-stats">
          <StatPill label="Total" value={stats.total} color="blue" />
          <StatPill label="Vistas" value={stats.watched} color="green" />
          <StatPill label="Pendientes" value={stats.pending} color="gold" />
          <StatPill label="Favoritas" value={stats.favorites} color="red" />
          {stats.avgRating > 0 && (
            <StatPill label="Mi promedio" value={`★ ${stats.avgRating}`} color="gold" />
          )}
        </div>

        <button className="btn-add" onClick={onAddClick}>
          <span>+</span> Agregar película
        </button>
      </div>
    </header>
  );
};

const StatPill = ({ label, value, color }) => (
  <div className={`stat-pill stat-pill--${color}`}>
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export default Header;
