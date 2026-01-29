import type React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "normal" | "hover" | "pressed" | "disabled";
};

const SRC = {
	normal: "url(/assets/ui/buttons/btn_gothic_purple_normal.png)",
	hover: "url(/assets/ui/buttons/btn_gothic_purple_hover.png)",
	pressed: "url(/assets/ui/buttons/btn_gothic_purple_pressed.png)",
	disabled: "url(/assets/ui/buttons/btn_gothic_purple_disabled.png)",
};

export const AetheriaButton: React.FC<ButtonProps> = ({
	variant = "normal",
	disabled,
	children,
	className = "",
	style,
	...props
}) => {
	const state = disabled ? "disabled" : variant;

	return (
		<button
			type="button"
			disabled={disabled}
			className={`
        relative inline-flex items-center justify-center
        font-gothic font-bold text-[#ede7ff] tracking-wider text-lg
        transition-all duration-200
        focus:outline-none focus:drop-shadow-[0_0_6px_rgba(157,0,255,0.5)]
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
			style={{
				border: "32px solid transparent",
				borderImageSource: SRC[state],
				borderImageSlice: "64 96 64 96 fill",
				borderImageWidth: "32px",
				borderImageRepeat: "stretch",
				background: "transparent",
				minWidth: "200px",
                padding: "4px 12px", // Adjust padding to center text visually within the 9-slice
				...style,
			}}
            onMouseEnter={(e) => !disabled && e.currentTarget.style.setProperty("border-image-source", SRC.hover)}
            onMouseLeave={(e) => !disabled && e.currentTarget.style.setProperty("border-image-source", SRC.normal)}
            onMouseDown={(e) => !disabled && e.currentTarget.style.setProperty("border-image-source", SRC.pressed)}
            onMouseUp={(e) => !disabled && e.currentTarget.style.setProperty("border-image-source", SRC.hover)}
			{...props}
		>
			<span className="relative z-10 drop-shadow-md transform -translate-y-1">{children}</span>
		</button>
	);
};
