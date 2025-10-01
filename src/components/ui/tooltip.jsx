import * as React from "react"
import PropTypes from 'prop-types'
import { cn } from "../../lib/utils"
import { Info } from 'lucide-react'

const TooltipProvider = ({ children }) => {
  return <>{children}</>
}
TooltipProvider.propTypes = {
  children: PropTypes.node
}

const Tooltip = ({ children, content, side = "top" }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="relative inline-flex">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg",
            "whitespace-normal max-w-xs break-words",
            "animate-in fade-in-0 zoom-in-95",
            side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
            side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
            side === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
            side === "right" && "left-full top-1/2 -translate-y-1/2 ml-2"
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45",
              side === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
              side === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
              side === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
              side === "right" && "left-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  )
}
Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  side: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
}

const TooltipTrigger = ({ children, className }) => {
  return (
    <button
      type="button"
      className={cn("inline-flex items-center", className)}
    >
      {children}
    </button>
  )
}
TooltipTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

const TooltipContent = ({ children, className }) => {
  return <div className={className}>{children}</div>
}
TooltipContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
}

const InfoTooltip = React.memo(({ content, side = "top" }) => {
  return (
    <Tooltip content={content} side={side}>
      <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 cursor-help hover:text-blue-600 dark:hover:text-blue-300 transition-colors" />
    </Tooltip>
  )
});
InfoTooltip.displayName = 'InfoTooltip';
InfoTooltip.propTypes = {
  content: PropTypes.node.isRequired,
  side: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
}

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, InfoTooltip }
