import { motion } from "framer-motion";

interface Props {
  badge?: string;
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ badge, title, subtitle }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mx-auto mb-12 max-w-2xl text-center"
  >
    {badge && (
      <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
        {badge}
      </span>
    )}
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
    {subtitle && (
      <p className="mt-4 text-muted-foreground">{subtitle}</p>
    )}
  </motion.div>
);

export default SectionHeading;
