import * as React from "react"
import PropTypes from 'prop-types'
import { cn } from "@/lib/utils"

const Alert = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn("rounded-lg border p-4", className)}
    {...props}
  />
))
Alert.displayName = "Alert"
Alert.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"
AlertDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export { Alert, AlertDescription }