// Card.jsx
import PropTypes from "prop-types";

export default function Card({ title, description, icon, children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 ${className}`}
    >
      {(title || description || icon) && (
        <div className="flex items-start gap-3">
          {icon && <div className="shrink-0">{icon}</div>}
          <div className="flex-1">
            {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
            {description && <p className="mt-1 text-sm text-zinc-300">{description}</p>}
          </div>
        </div>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,              // pass <Rocket className="w-5 h-5" /> etc.
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
