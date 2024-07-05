// import React, { useState } from 'react';
// import { ClassInfo, ClassItem } from '../types';

// interface Props {
//   onSubmit: (classInfo: ClassInfo) => void;
// }

// export default function ClassForm({ onSubmit }: Props) {
//   const [className, setClassName] = useState('');
//   const [items, setItems] = useState<ClassItem[]>([]);
//   const [currentItem, setCurrentItem] = useState<ClassItem>({
//     code: '',
//     module: '',
//     coefficient: 0,
//     continuousAssessment: 0,
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({
//       id: Date.now().toString(),
//       name: className,
//       items,
//     });
//     setClassName('');
//     setItems([]);
//     setCurrentItem({
//       code: '',
//       module: '',
//       coefficient: 0,
//       continuousAssessment: 0,
//     });
//   };

//   const handleItemChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     setCurrentItem({
//       ...currentItem,
//       [name]:
//         name === 'coefficient' || name === 'continuousAssessment'
//           ? parseFloat(value)
//           : value,
//     });
//   };

//   const addItem = () => {
//     setItems([...items, currentItem]);
//     setCurrentItem({
//       code: '',
//       module: '',
//       coefficient: 0,
//       continuousAssessment: 0,
//     });
//   };

//   return (
//     <div className="mb-4">
//       <form onSubmit={handleSubmit} className="mb-4">
//         <input
//           type="text"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//           placeholder="Class Name"
//           className="mr-2 p-2 border text-black"
//           required
//         />
//         <div className="my-2">
//           <input
//             type="text"
//             name="code"
//             value={currentItem.code}
//             onChange={handleItemChange}
//             placeholder="Code"
//             className="mr-2 p-2 border text-black"
//           />
//           <input
//             type="text"
//             name="module"
//             value={currentItem.module}
//             onChange={handleItemChange}
//             placeholder="Module"
//             className="mr-2 p-2 border text-black"
//           />
//           <input
//             type="number"
//             name="coefficient"
//             value={currentItem.coefficient}
//             onChange={handleItemChange}
//             placeholder="Coefficient"
//             className="mr-2 p-2 border text-black"
//           />
//           <input
//             type="number"
//             name="continuousAssessment"
//             value={currentItem.continuousAssessment}
//             onChange={handleItemChange}
//             placeholder="Continuous Assessment"
//             className="mr-2 p-2 border text-black"
//           />
//           <button
//             type="button"
//             onClick={addItem}
//             className="bg-green-500 text-white p-2 rounded"
//           >
//             Add Item
//           </button>
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-2 rounded"
//         >
//           Add Class
//         </button>
//       </form>

//       {items.length > 0 && (
//         <div>
//           <h3 className="text-lg font-semibold mb-2">
//             Current Items:
//           </h3>
//           <table className="w-full border-collapse border">
//             <thead>
//               <tr>
//                 <th className="border p-2">Code</th>
//                 <th className="border p-2">Module</th>
//                 <th className="border p-2">Coefficient</th>
//                 <th className="border p-2">Continuous Assessment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td className="border p-2">{item.code}</td>
//                   <td className="border p-2">{item.module}</td>
//                   <td className="border p-2">{item.coefficient}</td>
//                   <td className="border p-2">
//                     {item.continuousAssessment}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
