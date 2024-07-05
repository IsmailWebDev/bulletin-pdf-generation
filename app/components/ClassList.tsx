// import { ClassInfo } from '../types';

// interface Props {
//   classes: ClassInfo[];
// }

// export default function ClassList({ classes }: Props) {
//   const calculateFinalNote = (classInfo: ClassInfo) => {
//     const totalWeightedSum = classInfo.items.reduce(
//       (sum, item) =>
//         sum + item.coefficient * item.continuousAssessment,
//       0
//     );
//     const totalCoefficients = classInfo.items.reduce(
//       (sum, item) => sum + item.coefficient,
//       0
//     );
//     return totalWeightedSum / totalCoefficients;
//   };

//   return (
//     <div className="mb-4">
//       <h2 className="text-xl font-bold mb-2">Classes</h2>
//       {classes.map((classInfo) => (
//         <div key={classInfo.id} className="mb-4 border p-4">
//           <h3 className="text-lg font-semibold">{classInfo.name}</h3>
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
//               {classInfo.items.map((item, index) => (
//                 <tr key={index}>
//                   <td className="border p-2">{item.code}</td>
//                   <td className="border p-2">{item.module}</td>
//                   <td className="border p-2">{item.coefficient}</td>
//                   <td className="border p-2">
//                     {item.continuousAssessment}
//                   </td>
//                 </tr>
//               ))}
//               <tr>
//                 <td
//                   colSpan={3}
//                   className="border p-2 font-bold text-right"
//                 >
//                   Final Note:
//                 </td>
//                 <td className="border p-2 font-bold">
//                   {calculateFinalNote(classInfo).toFixed(2)}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }
